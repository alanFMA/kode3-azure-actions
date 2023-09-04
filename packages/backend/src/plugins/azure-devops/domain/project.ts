import { Axios } from 'axios';
import { IProjectInfo } from '../types';

export class AzureProjectService {
  constructor(
    private axios: Axios,
    private defaultOrganization: string
  ) {}

  async list(organization?: string): Promise<IProjectInfo[]> {
    let orgName = organization || this.defaultOrganization

    if(!orgName){
      const defaultRes = await this.axios.get('https://dev.azure.com', {
        headers: {
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"
        }
      })
      orgName = defaultRes.request.path
      orgName = orgName?.substring(1)
    }

    const resultRes = await this.axios.post<any, any>(
      `https://dev.azure.com/${orgName}/_apis/Contribution/HierarchyQuery`,
      JSON.stringify({"contributionIds": ["ms.vss-tfs-web.project-plus-product-data-provider"]}),
      {
        headers: {
          "Accept": "application/json;api-version=5.0-preview.1;excludeUrls=true;enumsAsNumbers=true;msDateFormat=true;noArrayWrap=true",
          "content-type": "application/json"

        }
      }
    )
    const { projects } = resultRes.data?.dataProviders?.["ms.vss-tfs-web.project-plus-product-data-provider"] ?? {projects: []}
    
    return projects
    
  }
}
