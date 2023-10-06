import { getRootLogger, loadBackendConfig } from '@backstage/backend-common';
import { azureAxiosInstance } from './axios';
import { BackstageConfigIntegrations } from '../../backstage-config';
import { AzureServiceConnectionService } from './service-connection';
import { Axios } from 'axios';

jest.setTimeout(300000);

describe('Azure DevOps Service Connection Services', () => {
  let axiosHandler: Axios;
  let service: AzureServiceConnectionService;
  let integrationsConfig: BackstageConfigIntegrations;
  const organization = 'org';
  const project = 'proj';

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
      service = new AzureServiceConnectionService(axiosHandler);
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

  test('list', async () => {
    const result = await service.list({ organization, project }, {type: 'kubernetes'});
    expect(result.data).toBeTruthy();
  });
});
