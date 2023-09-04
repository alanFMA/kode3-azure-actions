import axiosRetry from 'axios-retry';
import { setup } from 'axios-cache-adapter';
// import https from 'https';
// import http from 'http';


export function azureAxiosInstance(azurePat: string){


  // const httpAgent     = new http.Agent({ keepAlive: true });
  // const httpsAgent    = new https.Agent({ keepAlive: true });
  const AXIOS_TIMEOUT_SECONDS = 60;

  const axiosInstance = setup({
    // httpsAgent: httpsAgent,
    // httpAgent: httpAgent,
    timeout: 1000 * AXIOS_TIMEOUT_SECONDS,
    // cache: {
    //   maxAge: 5 * 60 * 1000,
    // },
  });

  axiosRetry(axiosInstance as any, {
    retries: 6,
    shouldResetTimeout: true,
    retryDelay: axiosRetry.exponentialDelay,
  });


  axiosInstance.interceptors.request.use(v => {
    v.auth = {
      username: '',
      password: azurePat,
    };

    v.params = {
      'api-version': '6.1-preview.1',
      ...v.params,
    };

    if(!v.headers) v.headers = {}
    if(!v.headers.Accept){
      v.headers.Accept = 'application/json;api-version=6.1-preview.1;excludeUrls=true;enumsAsNumbers=true;msDateFormat=true;noArrayWrap=true'
    }
    return v;
  });

  axiosInstance.interceptors.response.use(v => {
    if (
      typeof v.data === 'string' &&
      /^['"\[\{tf0-9nu]/.test(v?.data?.trimStart() || '')
    ) {
      v.data = JSON.parse(v.data);
    }
    if (v.data.$id) {
      v.status = 500;
      v.statusText = v.data.message;
    }
    return v;
  });

  return axiosInstance;
}