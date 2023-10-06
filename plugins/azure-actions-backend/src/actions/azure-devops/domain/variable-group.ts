import { Axios, AxiosResponse } from 'axios';
import { AzureRepositoryKey } from './repository.types';
import {
  AzureVariableGroupInfo,
  AzureDistributedVariableGroup,
} from './variable-group.types';
import { AzureProjectService } from './project';

export class AzureVariableGroupService {
  constructor(
    private axios: Axios,
    private projectService?: AzureProjectService,
  ) {}
  async list({
    organization,
    project,
  }: Pick<AzureRepositoryKey, 'organization' | 'project'>) {
    return this.axios.get<any, AxiosResponse<AzureVariableGroupInfo[]>>(
      `https://dev.azure.com/${organization}/${project}/_apis/distributedtask/variablegroups`,
    );
  }
  async getByRepoName({
    organization,
    project,
    repository,
  }: AzureRepositoryKey) {
    const filtered = await this.axios.get<
      any,
      AxiosResponse<AzureVariableGroupInfo[]>
    >(
      `https://dev.azure.com/${organization}/${project}/_apis/distributedtask/variablegroups?groupName=${repository}`,
    );

    return filtered.data[0];
  }
  async distributedTask({
    organization,
    project,
    repository,
  }: AzureRepositoryKey) {
    const filtered = await this.getByRepoName({
      organization,
      project,
      repository,
    });

    if (!filtered?.id) return undefined;

    return this.axios.get<any, AxiosResponse<AzureDistributedVariableGroup>>(
      `https://dev.azure.com/${organization}/${project}/_apis/distributedtask/variablegroups/${filtered.id}`,
      {
        params: {
          'api-version': '7.1-preview.2',
        },
      },
    );
  }
  async rename(
    renameTo: string,
    { organization, project, repository }: AzureRepositoryKey,
  ) {
    const detail = await this.distributedTask({
      organization,
      project,
      repository,
    });
    if (!detail) return undefined;

    const { variables, type, description, variableGroupProjectReferences } =
      detail.data;

    return this.axios.put<any, AxiosResponse<AzureDistributedVariableGroup>>(
      `https://dev.azure.com/${organization}/_apis/distributedtask/variablegroups/${detail.data.id}`,
      JSON.stringify({
        variables,
        type,
        name: renameTo,
        description,
        variableGroupProjectReferences: variableGroupProjectReferences.map(
          ref => {
            return { ...ref, name: renameTo };
          },
        ),
      }),
      {
        params: {
          'api-version': '7.1-preview.2',
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
    const detail = await this.distributedTask({
      organization,
      project,
      repository,
    });
    if (!detail) return undefined;

    return this.axios.delete<any, any>(
      `https://dev.azure.com/${organization}/${project}/_apis/distributedtask/variablegroups/${detail.data.id}?projectIds=${detail.data.variableGroupProjectReferences[0].projectReference.id}`,
      {
        params: {
          'api-version': '7.1-preview.2',
        },
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        validateStatus: useDefaultThrow ? undefined : () => true,
      },
    );
  }

  async create(
    {
      organization,
      project,
    }: Pick<AzureRepositoryKey, 'organization' | 'project'>,
    name: string,
    description: string,
    variables: Record<string, string>,
    useDefaultThrow = true,
  ) {
    const projects = await this.projectService?.list();

    const detail = projects?.find(p => p.projectName === project);

    if (!detail) return undefined;

    const payload = {
      name,
      description,
      // providerData: {
      //   description: "teste prov data desc",
      //   name: "teste prov data name",
      //   projectReference: detail.data.variableGroupProjectReferences
      // },
      type: '',
      variableGroupProjectReferences: [
        {
          name,
          description,
          projectReference: {
            id: detail.projectId,
            name: detail.projectName,
          },
        },
      ],
      variables,
    };

    // projectIds=${detail.data.variableGroupProjectReferences[0].projectReference.id}

    return this.axios.post<any, any>(
      `https://dev.azure.com/${organization}/_apis/distributedtask/variablegroups`,
      JSON.stringify(payload),
      {
        params: {
          'api-version': '7.1-preview.2',
        },
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        validateStatus: useDefaultThrow ? undefined : () => true,
      },
    );
  }
}
