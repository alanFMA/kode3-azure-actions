import { getRootLogger, loadBackendConfig } from '@backstage/backend-common';
import { azureAxiosInstance } from './axios';
import { BackstageConfigIntegrations } from '../../backstage-config';
import { AzureEntitlementsService } from './entitlements';
import { Axios } from 'axios';

jest.setTimeout(300000);

describe('Azure DevOps Entitlements Services', () => {
  let service: AzureEntitlementsService;
  let axiosHandler: Axios;
  let integrationsConfig: BackstageConfigIntegrations;
  const organization = 'org';
  const userName = 'user'
  const userEmail = `${userName}@org.onmicrosoft.com`
  
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
      service = new AzureEntitlementsService(axiosHandler);
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

  test('user projects', async () => {
    const result = await service.userEntitlements({ 
      organization, 
      select: 'Projects',
      $filter: `name eq '${userEmail}'`,
    });

    expect(result.status).toBe(200);
  });
});
