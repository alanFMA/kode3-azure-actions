import { Axios, AxiosResponse } from 'axios';
import {
  PagedGraphMemberList,
} from './entitlements.types';


export class AzureEntitlementsService {
  constructor(private axios: Axios) {}

  async userEntitlements<T extends "Projects" | "Extensions" | "Grouprules">({ 
    organization, 
    select,
    $filter
  }: {
    organization: string, 
    select: T,
    $filter: string
  }) {
    return this.axios.get<any, AxiosResponse<PagedGraphMemberList>>(
      `https://vsaex.dev.azure.com/${organization}/_apis/userentitlements`,
      {
        responseType: 'json',
        params: {
          'api-version': '6.0-preview.3',
          select: select.toString(),
          $filter, // : `name eq '${email}'`,
        },
        headers: {
          Accept: 'application/json'
        }
      }
    );
  }
}
