import { getRootLogger, loadBackendConfig } from '@backstage/backend-common';
import { azureAxiosInstance } from './axios';
import { BackstageConfigIntegrations } from '../../../backstage-config';
import { AzureEntitlementsService } from './entitlements';
import { Axios } from 'axios';

jest.setTimeout(300000);

describe('Azure DevOps Entitlements Services', () => {
  let service: AzureEntitlementsService;
  let axiosHandler: Axios;
  let integrationsConfig: BackstageConfigIntegrations;
  const organization = 'telefonica-vivo-brasil';
  const userName = 'alan.ferreira.ext'
  const userEmail = `${userName}@telefonicati.onmicrosoft.com`
  
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

  // test('raw mode', async () => {
  //   var axios = require("axios").default;

  //   var options = {
  //     method: 'GET',
  //     url: 'https://vsaex.dev.azure.com/telefonica-vivo-brasil/_apis/userentitlements',
  //     params: {
  //       select: 'Projects',
  //       $filter: 'name eq \'alan.ferreira.ext@telefonicati.onmicrosoft.com\'',
  //       'api-version': '6.0-preview.3'
  //     },
  //     headers: {
  //       // cookie: 'VstsSession=%257B%2522PersistentSessionId%2522%253A%2522f666c59c-47b8-4980-bd45-98a3e27b9596%2522%252C%2522PendingAuthenticationSessionId%2522%253A%252200000000-0000-0000-0000-000000000000%2522%252C%2522CurrentAuthenticationSessionId%2522%253A%252200000000-0000-0000-0000-000000000000%2522%252C%2522SignInState%2522%253A%257B%257D%257D',
  //       Authorization: 'Basic Om0yejRpMms2eHhnbGpuZWxzcHNwaTVhc3M3endieTJxeW1ubmRiY2t6NGJqbWtjZXpscGE='
  //     }
  //   };

  //   const res = await axios.request(options);
  //   expect(res.status).toEqual(200)

  // })

  test('user projects', async () => {
    const result = await service.userEntitlements({ 
      organization, 
      select: 'Projects',
      $filter: `name eq '${userEmail}'`,
    });

    expect(result.status).toBe(200);
  });
});
