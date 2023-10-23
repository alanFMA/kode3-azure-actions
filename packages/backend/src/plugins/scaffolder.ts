import { CatalogClient } from '@backstage/catalog-client';
import {
  createBuiltinActions,
  createRouter,
} from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import type { PluginEnvironment } from '../types';
import { ScmIntegrations } from '@backstage/integration';
import { createPluginRemoveAzureReposAction } from 'plugin-azure-actions-backend';
import { createPluginRemoveAzurePipelinesAction } from 'plugin-azure-actions-backend';
import { createPluginAddAzureVariableGroups } from 'plugin-azure-actions-backend';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const catalogClient = new CatalogClient({
    discoveryApi: env.discovery,
  });

  const integrations = ScmIntegrations.fromConfig(env.config);

  const builtInActions = createBuiltinActions({
    integrations,
    catalogClient,
    config: env.config,
    reader: env.reader,
  });

  const actions = [
    ...builtInActions,
    createPluginRemoveAzureReposAction({
      logger: env.logger,
      config: env.config,
    }),
    createPluginRemoveAzurePipelinesAction({
      logger: env.logger,
      config: env.config,
    }),
    createPluginAddAzureVariableGroups({
      logger: env.logger,
      config: env.config,
    }),
  ];

  return await createRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
    reader: env.reader,
    catalogClient,
    actions,
    identity: env.identity,
    permissions: env.permissions,
  });
}
