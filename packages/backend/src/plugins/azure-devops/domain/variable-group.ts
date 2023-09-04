import { Axios, AxiosResponse } from 'axios';
import { AzureRepositoryKey } from './repository.types';
import {
  AzureVariableGroupInfo,
  AzureDistributedVariableGroup,
} from './variable-group.types';

export class AzureVariableGroupService {
  constructor(private axios: Axios) {}
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
}
