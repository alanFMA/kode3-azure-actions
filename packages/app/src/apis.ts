import {
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
  ScmAuth,
} from '@backstage/integration-react';
import {
  AnyApiFactory,
  configApiRef,
  createApiFactory,
  discoveryApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { AzureDevOpsPluginApiClient, proxyAzurePluginApiRef } from './plugins/azure-devops-apiref';

export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: scmIntegrationsApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
  }),
  createApiFactory({
    api: proxyAzurePluginApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      identityApi: identityApiRef,
      configApi: configApiRef,
      // authApi: microsoftAuthApiRef
    },
    factory: config => new AzureDevOpsPluginApiClient(config),
  }),
  ScmAuth.createDefaultApiFactory(),
];
