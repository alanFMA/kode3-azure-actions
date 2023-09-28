import { CatalogClient } from '@backstage/catalog-client';
import {
  createBuiltinActions,
  createRouter,
} from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import type { PluginEnvironment } from '../types';
import { createPluginMiddlewareAction } from './scaffolder/actions/custom';
import { ScmIntegrations } from '@backstage/integration';
import { createPluginRemoveAzureReposAction } from './scaffolder/actions/deleteRepositories';
import { createPluginRemoveAzurePipelinesAction } from './scaffolder/actions/deletePipelines';
import { createPluginAddVariableGroups } from './scaffolder/actions/addVariables';

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
    createPluginMiddlewareAction(),
    createPluginRemoveAzureReposAction({
      logger: env.logger,
      config: env.config,
    }),
    createPluginRemoveAzurePipelinesAction({
      logger: env.logger,
      config: env.config,
    }),
    createPluginAddVariableGroups({
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
