import { Config } from '@backstage/config';
import {
  AzureVariableGroupService,
  AzureProjectService,
  azureAxiosInstance,
} from './azure-devops/domain/';
import { PluginEnvironment } from './types';
import { createTemplateAction } from '@backstage/plugin-scaffolder-backend';
import { BackstageConfigAzureElement } from './backstage-config';

export const createPluginAddAzureVariableGroups = (options: {
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
  const projectService = new AzureProjectService(
    azAxios,
    integrations[0].organization!,
  );
  const azureVariableGroupService = new AzureVariableGroupService(
    azAxios,
    projectService,
  );

  return createTemplateAction<{
    organization: string;
    description: string;
    variables: Record<string, string>;
  }>({
    id: 'kode3:add-variables',
    schema: {
      input: {
        required: ['name', 'description', 'variables'],
        type: 'object',
        properties: {
          name: {
            type: 'string',
            title: 'Name',
            description: 'The name of the variable group',
          },
          description: {
            type: 'string',
            title: 'Description',
            description: 'The description of the variable group',
          },
          variables: {
            type: 'object',
            title: 'Variables',
            description: 'The variables to add to the group',
          },
        },
      },
    },
    async handler(ctx: any) {
      const variables: Record<string, string> = ctx.input.variables || {};

      try {
        const createResponse = await azureVariableGroupService.create(
          { organization: 'kode3tech', project: 'kode3-test' },
          ctx.input.name,
          ctx.input.description,
          variables,
          true,
        );

        console.log('Grupo de variáveis criado:', createResponse);

        if (createResponse && createResponse.data) {
          ctx.logger.info(
            `Grupo de variáveis criado com sucesso: ${createResponse.data.name}`,
          );
        } else {
          console.error('Resposta inválida:', createResponse);
        }
      } catch (error: any) {
        ctx.logger.error(`Error:\n${error}`);

        if (error.response !== undefined) {
          if (
            error.response.status !== undefined &&
            error.response.data !== undefined &&
            typeof error.response.status === 'number'
          ) {
            console.error('Status da resposta:', error.response.status);
            console.error('Dados da resposta de erro:', error.response.data);
          }
        }
      }
    },
  });
};
