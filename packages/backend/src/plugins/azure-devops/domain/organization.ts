import { Axios } from 'axios';
import { IOrganizationInfo } from '../types';

export class AzureOrganizationService {
  constructor(
    private axios: Axios,
    private defaultOrganization: string
  ) {}

  async list(): Promise<IOrganizationInfo[]> {
    
    if(!this.defaultOrganization) {
      const defaultRes = await this.axios.get('https://dev.azure.com', {
        headers: {
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"
        }
      })
      this.defaultOrganization = defaultRes.request.path
      this.defaultOrganization = this.defaultOrganization.substring(1)
    }

    const resultRes = await this.axios.post<any, any>(
      `https://dev.azure.com/${this.defaultOrganization}/_apis/Contribution/HierarchyQuery`,
      JSON.stringify({"contributionIds": ["ms.vss-features.my-organizations-data-provider"]}),
      {
        headers: {
          "Accept": "application/json;api-version=5.0-preview.1;excludeUrls=true;enumsAsNumbers=true;msDateFormat=true;noArrayWrap=true",
          "content-type": "application/json"

        }
      }
    )

    return resultRes.data?.dataProviders["ms.vss-features.my-organizations-data-provider"].organizations
    ;
  }
}
