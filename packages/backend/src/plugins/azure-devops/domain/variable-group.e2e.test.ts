import { getRootLogger, loadBackendConfig } from '@backstage/backend-common';
import { azureAxiosInstance } from './axios';
import { BackstageConfigIntegrations } from '../../../backstage-config';
import { AzureVariableGroupService } from './variable-group';
import { Axios } from 'axios';
import { AzureProjectService } from './project';

jest.setTimeout(300000);

describe('Azure DevOps Library Group Services', () => {
  let axiosHandler: Axios;
  let projectService: AzureProjectService;
  let service: AzureVariableGroupService;
  let integrationsConfig: BackstageConfigIntegrations;
  const organization = 'telefonica-vivo-brasil';
  const project = 'TechArchitecture';
  const repository = 'ms-teste-integrado-v1';
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
      projectService = new AzureProjectService(axiosHandler, organization);
      service = new AzureVariableGroupService(axiosHandler, projectService);
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

  // test('list', async () => {
  //   const result = await service.list({ organization, project });
  //   expect(result.data).toBeTruthy();
  // });
  // test('getByRepoName', async () => {
  //   const result = await service.getByRepoName({
  //     organization,
  //     project,
  //     repository,
  //   });
  //   expect(result.id).toBeTruthy();
  //   expect(result.name).toEqual(repository);
  // });

  // test('distributedTask', async () => {
  //   const distributedTask = await service.distributedTask({
  //     organization,
  //     project,
  //     repository,
  //   });
  //   expect(distributedTask).toBeTruthy();
  //   expect(distributedTask?.data?.name).toEqual(repository);
  // });

  // test('rename', async () => {
  //   const res = await service.rename(renameTo, {
  //     organization,
  //     project,
  //     repository,
  //   });
  //   expect(res).toBeDefined();

  //   expect(res?.status).not.toBe(500);
  //   expect(res?.data.name).toBe(repository);

  //   await service.rename(repository, {
  //     organization,
  //     project,
  //     repository: renameTo,
  //   });
  // });

  // test('remove', async () => {
  //   const result = await service.remove({
  //     organization,
  //     project,
  //     repository: 'RECREATED-1658325737455-remove-test-06',
  //   });

  //   expect(result?.status).toBeDefined();
  //   expect(result?.status).not.toBe(500);
  // });

  test('create', async () => {
    const result = await service.create(
      { organization, project},
      'teste-novo-var', 'desc teste novo var', 
      {'var-one': 'value-one', 'var-two': 'value two'});

    expect(result?.status).toBeDefined();
    expect(result?.status).not.toBe(500);
  });
});
