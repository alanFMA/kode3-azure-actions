import { Config } from '@backstage/config';
import { AzureRepoService, azureAxiosInstance } from './azure-devops/domain/';
import { PluginEnvironment } from './types';
import { createTemplateAction } from '@backstage/plugin-scaffolder-backend';
import { BackstageConfigAzureElement } from './backstage-config';

interface Repo {
  id: string;
  name: string;
}

export const createPluginRemoveAzureReposAction = (options: {
  logger: PluginEnvironment['logger'];
  config: Config;
}) => {
  const integrations =
    options.config.get<BackstageConfigAzureElement[]>('integrations.azure');

  const token = integrations?.find(() => true)?.token;

  if (!token) {
    throw new Error('Missing config "integrations.azure.token" !');
  }

  const azAxios = azureAxiosInstance(token);

  const repoService = new AzureRepoService(azAxios);

  return createTemplateAction<{
    selectazurerepos: string[];
    organization: string;
    project: string;
  }>({
    id: 'kode3:remove-azure-repos',
    schema: {
      input: {
        required: ['selectazurerepos', 'organization', 'project'],
        type: 'object',
        properties: {
          selectazurerepos: {
            type: 'array',
            title: 'Contents',
            description: 'The contents of the file',
          },
          organization: {
            type: 'string',
            title: 'Contents',
            description: 'The contents of the file',
          },
          project: {
            type: 'string',
            title: 'Contents',
            description: 'The contents of the file',
          },
        },
      },
    },
    async handler(ctx) {
      const repo: Repo[] = ctx.input.selectazurerepos.map(s => JSON.parse(s));
      repo.map(r => {
        try {
          repoService.remove({
            organization: ctx.input.organization,
            project: ctx.input.project,
            repository: r.id,
          });
          ctx.logger.info(`Repositório deletado: ${r.name}`);
        } catch (error) {
          ctx.logger.error(error);
        }
      });
    },
  });
};
