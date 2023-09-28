import { Axios, AxiosResponse } from 'axios';
import {
  AzurePipelineInfo,
  AzurePipelineKey,
  AzurePipelineDefinition,
  AzurePipelineRunResult,
} from './pipeline.types';
import { AzureRepositoryKey } from './repository.types';
import { AzureRepoService } from './repository';

export class AzurePipelineService {
  constructor(private axios: Axios, private repoService?: AzureRepoService) {}

  async list({
    organization,
    project,
  }: Pick<AzurePipelineKey, 'organization' | 'project'>) {
    return this.axios.get<any, AxiosResponse<Array<AzurePipelineInfo>>>(
      `https://dev.azure.com/${organization}/${project}/_apis/pipelines`,
    );
  }
  async getByRepoName({
    organization,
    project,
    repository,
  }: AzureRepositoryKey) {
    const { data } = await this.list({ organization, project });
    return data.find(pipe => pipe.name === repository);
  }
  async create({ organization, project, repository }: AzureRepositoryKey) {
    const repositoryResponse = await this.repoService?.info({
      organization,
      project,
      repository,
    });
    const repositoryInfo = repositoryResponse?.data;
    if (!repositoryInfo) return undefined;

    const payload = {
      variables: '',
      triggers: [
        {
          branchFilters: [],
          pathFilters: [],
          settingsSourceType: 2,
          batchChanges: true,
          maxConcurrentBuildsPerBranch: 1,
          triggerType: 'continuousIntegration',
        },
      ],
      retentionRules: [
        {
          branches: ['+refs/heads/*', '+refs/tags/*'],
          daysToKeep: 10,
          minimumToKeep: 1,
          deleteBuildRecord: true,
          deleteTestResults: true,
        },
      ],
      queue: {
        name: 'Default',
        pool: { name: 'Default' },
      },
      buildNumberFormat: '$(date:yyyyMMdd)$(rev:.r)',
      jobAuthorizationScope: 1,
      jobTimeoutInMinutes: 60,
      jobCancelTimeoutInMinutes: 5,
      process: {
        yamlFilename: '.azuredevops/pipeline-azure.yml',
        type: 2,
      },
      repository: {
        properties: {
          safeRepository: repositoryInfo.id,
          reportBuildStatus: true,
          fetchDepth: 0,
          cleanOptions: 3,
          gitLfsSupport: false,
          skipSyncSource: false,
          checkoutNestedSubmodules: false,
        },
        id: repositoryInfo.id,
        type: 'TfsGit',
        name: repositoryInfo.id,
        defaultBranch: 'refs/heads/master',
        clean: true,
        checkoutSubmodules: false,
      },
      name: repositoryInfo.name,
      path: '\\',
      type: 2,
      project: {
        id: repositoryInfo.project.id,
      },
    };

    return this.axios.post<any, AxiosResponse<AzurePipelineDefinition>>(
      `https://dev.azure.com/${organization}/${repositoryInfo.project.id}/_apis/build/definitions`,
      JSON.stringify(payload),
      {
        params: {
          'api-version': '7.0',
        },
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      },
    );
  }

  async definition({ organization, project, repository }: AzureRepositoryKey) {
    const info = await this.getByRepoName({
      organization,
      project,
      repository,
    });
    if (!info) return undefined;

    const { id, revision } = info;

    return this.axios.get<any, AxiosResponse<AzurePipelineDefinition>>(
      `https://dev.azure.com/${organization}/${project}/_apis/build/definitions/${id}`,
      {
        params: {
          'api-version': '7.0',
          revision,
        },
      },
    );
  }
  async rename(
    renameTo: string,
    { organization, project, repository }: AzureRepositoryKey,
  ) {
    const res = await this.definition({ organization, project, repository });
    if (!res) return undefined;
    const { id: definitionId } = res.data;

    return this.axios.put<any, AxiosResponse<AzurePipelineDefinition>>(
      `https://dev.azure.com/${organization}/${project}/_apis/build/definitions/${definitionId}`,
      JSON.stringify({
        ...res.data,
        name: renameTo,
      }),
      {
        params: {
          'api-version': '7.0',
        },
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      },
    );
  }

  async remove(
    { organization, project, repository }: AzureRepositoryKey,
    useDefaultThrow = true,
  ): Promise<AxiosResponse | undefined> {
    const res = await this.definition({ organization, project, repository });
    if (!res) return undefined;

    const { id: definitionId } = res.data;
    return this.axios.delete<any, any>(
      `https://dev.azure.com/${organization}/${project}/_apis/build/definitions/${definitionId}`,
      {
        params: {
          'api-version': '7.0',
        },
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        validateStatus: useDefaultThrow ? undefined : () => true,
      },
    );
  }

  async run(
    { organization, project, repository }: AzureRepositoryKey,
    {
      stagesToSkip,
      resources,
      templateParameters,
      variables,
    }: {
      stagesToSkip?: [];
      resources?: {
        repositories: { self: { refName: string } };
      };
      templateParameters?: Record<string, string | number | boolean>;
      variables?: Record<string, string | number | boolean>;
    },
  ) {
    const res = await this.definition({ organization, project, repository });
    if (!res) return undefined;

    const { id: definitionId } = res.data;

    return this.axios.post<any, AxiosResponse<AzurePipelineRunResult>>(
      `https://dev.azure.com/${organization}/${project}/_apis/pipelines/${definitionId}/runs?api-version=7.0`,
      JSON.stringify({
        ...{
          resources: {
            repositories: { self: { refName: 'refs/heads/master' } },
          },
        },
        stagesToSkip,
        resources,
        templateParameters,
        variables,
        previewRun: 'false',
      }),
      {
        params: {
          'api-version': '7.0',
        },
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      },
    );
  }
}
