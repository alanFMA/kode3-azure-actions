import {
  createApiRef,
  DiscoveryApi,
  IdentityApi
} from '@backstage/core-plugin-api';

// import { OpenIdConnectApi } from '@backstage/core-plugin-api';

import { Organization, Project } from './types';

export interface AzureDevOpsPluginApi {
  allowedOrganizations(): Promise<Organization[]>;
  allowedProjects(organization: string): Promise<Project[]>;
  repositories(organization: string, project: string): Promise<any[]>;
}

export class AzureDevOpsPluginApiClient implements AzureDevOpsPluginApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly identityApi: IdentityApi;
  // private readonly authApi: OpenIdConnectApi;

  constructor(options: {
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
    // authApi: OpenIdConnectApi;
  }) {
    this.discoveryApi = options.discoveryApi
    this.identityApi = options.identityApi;
    // this.authApi = options.authApi;
  }

  private async baseUrl() {
    return await this.discoveryApi.getBaseUrl('azure-devops');
  }

  private async headers(): Promise<Record<string, string>> {
    const { token } = await this.identityApi.getCredentials();
    if (!token) {
      throw new Error('Failed to get authentication token');
    }
    return { Authorization: `Bearer ${token}` };
  }

  async allowedOrganizations(): Promise<Organization[]>{
    const url = await this.baseUrl();
    const endpoint = `${url}/organizations`;
    const defaultHeaders = await this.headers();
    return (await fetch(endpoint, {headers: defaultHeaders})).json();
  }

  async allowedProjects(organization: string): Promise<Project[]>{
    const url = await this.baseUrl();
    const endpoint = `${url}/projects/${organization}`;
    const defaultHeaders = await this.headers();
    return (await fetch(endpoint, {headers: defaultHeaders})).json();
  }

  async repositories(organization: string, projects: string): Promise<any[]>{
    const url = await this.baseUrl();
    const endpoint = `${url}/repositories/${organization}/${projects}`;
    const defaultHeaders = await this.headers();
    return (await fetch(endpoint, {headers: defaultHeaders})).json();
  }
}

export const proxyAzurePluginApiRef = createApiRef<AzureDevOpsPluginApi>({
  id: 'plugin.azure-devops.api',
});
