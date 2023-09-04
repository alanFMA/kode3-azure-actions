import { getRootLogger, loadBackendConfig } from '@backstage/backend-common';
import { azureAxiosInstance } from './axios';
import { BackstageConfigIntegrations } from '../../backstage-config';
import { AzurePipelineService } from './pipeline';
import { AzureRepoService } from './repository';
import { Axios } from 'axios';

jest.setTimeout(600000);

describe('Azure DevOps Pipeline Services', () => {
  let axiosHandler: Axios;
  let service: AzurePipelineService;
  let repoService: AzureRepoService;
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

});
