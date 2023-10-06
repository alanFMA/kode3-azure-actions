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
    throw new Error('Missing config "integrations.azure[0].token" !');
  }

  const azAxios = azureAxiosInstance(token);

  const repoService = new AzureRepoService(azAxios);

  return createTemplateAction<{
    selectazurerepos: string[];
  }>({
    id: 'kode3:remove-azure-repos',
    schema: {
      input: {
        required: 'selectazurerepos',
        type: 'object',
        properties: {
          selectazurerepos: {
            type: 'array',
            title: 'Contents',
            description: 'The contents of the file',
          },
        },
      },
    },
    async handler(ctx) {
      const repo: Repo[] = ctx.input.selectazurerepos.map(s => JSON.parse(s));
      ctx.logger.info(`Contexts:\n${JSON.stringify(repo, null, 2)}`);
      repo.map(r => {
        try {
          repoService.remove({
            organization: 'kode3tech',
            project: 'kode3-test',
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
