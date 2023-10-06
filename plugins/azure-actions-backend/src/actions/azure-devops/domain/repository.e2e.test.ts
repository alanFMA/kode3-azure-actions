import { getRootLogger, loadBackendConfig } from '@backstage/backend-common';
import { azureAxiosInstance } from './axios';
import { BackstageConfigIntegrations } from '../../backstage-config';
import { AzureRepoService } from './repository';
import { Axios } from 'axios';

jest.setTimeout(300000);

describe('Azure DevOps Repository Services', () => {
  let service: AzureRepoService;
  let axiosHandler: Axios;
  let integrationsConfig: BackstageConfigIntegrations;
  // const organization = 'my-org';
  // const project = 'az-project-test';
  // const repository = 'bk-teste-22';
  // const renameTo = `DELETE-ME-${repository}`;
  // const repoKey = {
  //   organization,
  //   project,
  //   repository,
  // };

  beforeAll(async () => {
    const logger = getRootLogger();
    const config = await loadBackendConfig({
      logger,
      argv: process.argv,
    });
    integrationsConfig =
      config?.get<BackstageConfigIntegrations>('integrations') || {};
    const azurePAT =
      integrationsConfig?.azure?.find(() => true)?.token ||
      process.env.AZURE_DEVOPS_TOKEN ||
      '';
    try {
      axiosHandler = azureAxiosInstance(azurePAT);
      service = new AzureRepoService(axiosHandler);
    } catch (error) {
      logger.error(error);
    }
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('Service instance check', async () => {
    expect(service).toBeDefined();
  });

  // test('exists', async () => {
  //   const result = await service.info({ organization, project, repository });

  //   expect(result.status).not.toBe(500);
  // });

  // test('rename', async () => {
  //   const res = await service.rename(renameTo, repoKey);
  //   expect(res.status).not.toBe(500);
  //   expect(res.data.name).toBe(renameTo);

  //   await service.rename(repository, {
  //     organization,
  //     project,
  //     repository: renameTo,
  //   });
  // });

  // test('item', async () => {
  //   const res = await service.item('/catalog-info.yaml', 'master', repoKey);
  //   expect(res.status).not.toBe(500);
  //   expect(res.data.commitId).toBeDefined();
  // });

  // test('push', async () => {
  //   const {
  //     data: { content: catalogInfoContent, commitId },
  //   } = await service.item('/catalog-info.yaml', 'master', repoKey);

  //   const pushResult = await service.push(
  //     {
  //       commits: [
  //         {
  //           comment: 'Repository push test',
  //           changes: [
  //             {
  //               changeType: 2,
  //               item: {
  //                 path: '/catalog-info.yaml',
  //               },
  //               newContent: {
  //                 content: `# Repository push Test ${new Date().getTime()}\n${catalogInfoContent}`,
  //                 contentType: 0,
  //               },
  //             },
  //           ],
  //         },
  //       ],
  //       refUpdates: [
  //         {
  //           name: 'refs/heads/master',
  //           oldObjectId: commitId,
  //         },
  //       ],
  //     },
  //     repoKey,
  //   );

  //   expect(pushResult.status).not.toBe(500);
  //   expect(pushResult.data.id).toBeDefined();
  // });

  // test('list', async () => {
  //   const result = await service.list({ organization, project });

  //   expect(result.status).not.toBe(500);
  // });

  // test('remove', async () => {
  //   const result = await service.remove({
  //     organization,
  //     project,
  //     repository: 'RECREATED-1657911959804-remove-test-06',
  //   });

  //   expect(result?.status).not.toBe(500);
  // });

  // test('clean RECREATED-*', async () => {
  //   const org = {organization: 'org', project: 'proj'}
  //   const allrepo = await service.list(org)
  //   const filtered = allrepo.data.filter(r => r.name.toLocaleLowerCase().startsWith('recreated-'))
  //   for (const { name: repo_name } of filtered) {
      
  //     const result = await service.remove({
  //       ...org,
  //       repository: repo_name,
  //     });
  //     expect(result?.status).not.toBe(500);
  //   }
  // });

});
