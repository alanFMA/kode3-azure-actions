import { createTemplateAction } from '@backstage/plugin-scaffolder-backend';



export const createPluginMiddlewareAction = () => {
    return createTemplateAction<{ component_id: string,
      owner: string,
      url: string,
      programming: string,
      multiselect: string[] }>({
        id: 'kode3:plugin-middlewares',
        schema: {
          input: {
            required: ['component_id', 'owner', 'url', 'programming', 'multiselect'],
            type: 'object',
            properties: {
              component_id: {
                type: 'string',
                title: 'Contents',
                description: 'The contents of the file',
              },
              owner: {
                type: 'string',
                title: 'Contents',
                description: 'The contents of the file',
              },
              url: {
                type: 'string',
                title: 'Contents',
                description: 'The contents of the file',
              },
              programming: {
                type: 'string',
                title: 'Contents',
                description: 'The contents of the file',
              },
              multiselect: {
                type: 'array',
                title: 'Contents',
                description: 'The contents of the file',
              },
            },
          },
        },
        async handler(ctx) {
            ctx.logger.info(`Contexts:\n${(JSON.stringify(ctx.input, null, 2))}`);
        },
    });
};