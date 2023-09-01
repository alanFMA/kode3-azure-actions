import { getRootLogger, loadBackendConfig } from '@backstage/backend-common';
import { azureAxiosInstance } from './axios';
import { BackstageConfigIntegrations } from '../../../backstage-config';
import { AzurePipelineService } from './pipeline';
import { AzureRepoService } from './repository';
import { Axios } from 'axios';

jest.setTimeout(600000);

describe('Azure DevOps Pipeline Services', () => {
  let axiosHandler: Axios;
  let service: AzurePipelineService;
  let repoService: AzureRepoService;
  let integrationsConfig: BackstageConfigIntegrations;
  const organization = 'telefonica-vivo-brasil';
  const project = 'ID000061-mvp-cloud';
  const repository = 'TF.cosmos-test';
  const renameTo = `DELETE-ME-${repository}`;

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
      repoService = new AzureRepoService(axiosHandler);
      service = new AzurePipelineService(axiosHandler, repoService);
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
  //   const result = await service.list({ organization, project });
  //   expect(result.data[0].id).toBeTruthy();
  // });

  // test('getByRepoName', async () => {
  //   const result = await service.getByRepoName({
  //     organization,
  //     project,
  //     repository,
  //   });
  //   expect(result?.id).toBeTruthy();
  // });
  // test('definition', async () => {
  //   const info = await service.definition({
  //     organization,
  //     project,
  //     repository,
  //   });
  //   expect(info).toBeDefined();
  //   expect(info?.data?.name).toBe(repository);
  // });

  // test('rename', async () => {
  //   const res = await service.rename(renameTo, {
  //     organization,
  //     project,
  //     repository,
  //   });
  //   expect(res).toBeDefined();

  //   expect(res?.status).not.toBe(500);
  //   expect(res?.data.name).toBe(renameTo);

  //   await service.rename(repository, {
  //     organization,
  //     project,
  //     repository: renameTo,
  //   });
  // }, 120000);

  // test('create', async () => {
  //   await service.rename(`${repository}-old`, {
  //     organization,
  //     project,
  //     repository,
  //   });

  //   const res = await service.create({
  //     organization,
  //     project,
  //     repository,
  //   });

  //   expect(res).toBeDefined();

  //   expect(res?.status).not.toBe(500);
  //   expect(res?.data.name).toBe(repository);
  // }, 120000);

  // test('remove', async () => {
  //   const result = await service.remove({
  //     organization,
  //     project,
  //     repository: 'RECREATED-1655145800977-remove-test-06',
  //   });

  //   expect(result?.status).toBeDefined();
  //   expect(result?.status).not.toBe(500);
  // });

  // test('run', async () => {
  //   const result = await service.run({
  //     organization,
  //     project,
  //     repository,
  //   }, {
  //     templateParameters: {
  //       environment: 'dev',
  //       action: 'apply'
  //     }
  //   });

  //   expect(result?.status).toBeDefined();
  //   expect(result?.status).toBe(200);
  // });

  // test('clean RECREATED-*', async () => {
  //   const org = {organization: 'telefonica-vivo-brasil', project: 'ID000061-mvp-cloud'}
  //   const allpipe = await service.list(org)
  //   const filtered = allpipe.data.filter(r => r.name.toLocaleLowerCase().startsWith('recreated-'))
  //   for (const { name: repo_name } of filtered) {
      
  //     const result = await service.remove({
  //       ...org,
  //       repository: repo_name,
  //     });
  //     expect(result?.status).not.toBe(500);
  //   }
  // });

});
