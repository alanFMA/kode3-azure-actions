import { Axios, AxiosResponse } from 'axios';
import { AzureRepositoryKey } from './repository.types';
import {
  AzureServiceConnectionInfo,
} from './service-connection.types';

export interface ListParams {
  type?: string,
  authSchemes?: string,
  endpointIds?: string,
  owner?: string,
  includeFailed?: string,
  includeDetails?: string,
}

export class AzureServiceConnectionService {
  constructor(private axios: Axios) {}
  async list(key: Pick<AzureRepositoryKey, 'organization' | 'project'>, params?: ListParams) {
    const {
      organization,
      project,
    } = key
    const {
      type,
      authSchemes,
      endpointIds,
      owner,
      includeFailed,
      includeDetails,
    } = params || {}

    return this.axios.get<any, AxiosResponse<AzureServiceConnectionInfo[]>>(
      `https://dev.azure.com/${organization}/${project}/_apis/serviceendpoint/endpoints`,{
        params: {
          'api-version': '7.0',
          type,
          authSchemes,
          endpointIds,
          owner,
          includeFailed,
          includeDetails,
        }
      }
    );
  }
}
