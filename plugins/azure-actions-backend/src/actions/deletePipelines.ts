import { Config } from '@backstage/config';
import {
  AzurePipelineService,
  azureAxiosInstance,
} from './azure-devops/domain/';
import { PluginEnvironment } from './types';
import { createTemplateAction } from '@backstage/plugin-scaffolder-backend';
import { BackstageConfigAzureElement } from './backstage-config';

interface Pipelines {
  id: string;
  name: string;
}

export const createPluginRemoveAzurePipelinesAction = (options: {
  logger: PluginEnvironment['logger'];
  config: Config;
}) => {
  const integrations =
    options.config.get<BackstageConfigAzureElement[]>('integrations.azure');

  const token = integrations?.find(() => true)?.token;

  if (!token) {
    throw new Error('Missing config "integrations.azure[0].token" !');
  }

  const azAxios = azureAxiosInstance(token);

  const pipelineService = new AzurePipelineService(azAxios);

  return createTemplateAction<{
    selectazurepipelines: string[];
  }>({
    id: 'kode3:remove-azure-pipelines',
    schema: {
      input: {
        required: 'selectazurepipelines',
        type: 'object',
        properties: {
          selectazurepipelines: {
            type: 'array',
            title: 'Contents',
            description: 'The contents of the file',
          },
        },
      },
    },
    async handler(ctx) {
      const pipeline: Pipelines[] = ctx.input.selectazurepipelines.map(s =>
        JSON.parse(s),
      );
      // ctx.logger.info(`Contexts:\n${pipeline}`);
      for (const p of pipeline) {
        try {
          pipelineService.remove({
            organization: 'kode3tech',
            project: 'kode3-test',
            repository: p.name,
          });
          ctx.logger.info(`Repositório deletado: ${p.name}`);
        } catch (error) {
          ctx.logger.error(error);
        }
      }
    },
  });
};
