import { getRootLogger, loadBackendConfig } from '@backstage/backend-common';
import { azureAxiosInstance } from './axios';
import { BackstageConfigIntegrations } from '../../../backstage-config';
import { AzureOrganizationService } from './organization';
import { Axios } from 'axios';

jest.setTimeout(60000);

describe('Azure DevOps Organization Services', () => {
  let axiosHandler: Axios;
  let service: AzureOrganizationService;
  let integrationsConfig: BackstageConfigIntegrations;

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
    
      const defaultOrganization = integrationsConfig?.azure?.find(() => true)?.organization ?? ''

    try {
      axiosHandler = azureAxiosInstance(azurePAT);
      service = new AzureOrganizationService(axiosHandler, defaultOrganization);
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

  test('exists', async () => {
    const result = await service.list();
    expect(result[0].id).toBeTruthy();
  });

});
