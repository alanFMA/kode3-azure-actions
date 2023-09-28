import { Axios, AxiosResponse } from 'axios';

import {
  AzureRepositoryInfo,
  AzureRepositoryItem,
  AzureRepositoryKey,
  AzureRepositoryPush,
} from './repository.types';

export class AzureRepoService {
  constructor(private axios: Axios) {}

  async info({ organization, project, repository }: AzureRepositoryKey) {
    return this.axios.get<any, AxiosResponse<AzureRepositoryInfo>>(
      `https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repository}`,
    );
  }
  /**
   * Rename repository using prefix to future deleted, deletion must be done manually.
   * @param param0
   * @param prefix
   * @returns
   */
  async rename(
    renameTo: string,
    { organization, project, repository }: AzureRepositoryKey,
  ) {
    const {
      data: {
        id: repoId,
        project: { id: projectId },
      },
    } = await this.info({ organization, project, repository });

    return this.axios.patch<any, AxiosResponse<AzureRepositoryInfo>>(
      `https://dev.azure.com/${organization}/${projectId}/_apis/git/Repositories/${repoId}`,
      JSON.stringify({
        id: repoId,
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
  async item(
    path: string,
    branch: string,
    { organization, project, repository }: AzureRepositoryKey,
  ) {
    return this.axios.get<any, AxiosResponse<AzureRepositoryItem>>(
      `https://dev.azure.com/${organization}/${project}/_apis/git/Repositories/${repository}/Items?path=${path}&recursionLevel=0&includeContentMetadata=true&versionDescriptor.version=${branch}&versionDescriptor.versionOptions=0&versionDescriptor.versionType=0&includeContent=true&resolveLfs=true`,
    );
  }
  async push(
    { commits, refUpdates }: AzureRepositoryPush,
    { organization, project, repository }: AzureRepositoryKey,
  ) {
    return this.axios.post<any, AxiosResponse<AzureRepositoryInfo>>(
      `https://dev.azure.com/${organization}/${project}/_apis/git/Repositories/${repository}/pushes`,
      JSON.stringify({
        commits: commits.map(c => {
          return { ...c, comment: `chore (Backstage Info): ${c.comment}` };
        }),
        refUpdates,
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
  async list({
    organization,
    project,
  }: Pick<AzureRepositoryKey, 'organization' | 'project'>) {
    return this.axios.get<any, AxiosResponse<AzureRepositoryInfo[]>>(
      `https://dev.azure.com/${organization}/${project}/_apis/git/Repositories`,
    );
  }

  async remove(
    { organization, project, repository }: AzureRepositoryKey,
    useDefaultThrow = true,
  ) {
    const { data } = await this.info({ organization, project, repository });

    if (!data?.id || !data?.project?.id) return undefined;

    const {
      id: repoId,
      project: { id: projectId },
    } = data;

    return this.axios.delete(
      `https://dev.azure.com/${organization}/${projectId}/_apis/git/Repositories/${repoId}`,
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
}
