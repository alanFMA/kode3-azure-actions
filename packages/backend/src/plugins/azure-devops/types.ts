export enum PathsEnum {
  catalogInfo = '/catalog-info.yaml',
}

export interface IProjectKey {
  organization: string;
  project: string;
}

export interface GitItem extends IProjectKey {
  repository: string;
  sourceBranch?: string;
  path: string;
  content?: string;
}

export interface EntityYaml<T extends {} = {}>
  extends Pick<
    GitItem,
    'organization' | 'project' | 'repository' | 'sourceBranch' | 'path'
  > {
  entity?: T;
}
export interface UpdateEntityYaml
  extends Pick<
    GitItem,
    'organization' | 'project' | 'repository' | 'sourceBranch' | 'path'
  > {
  /**
   * Yaml paths and respective sets values
   */
  sets: { [path: string]: any };
  pullRequestComment: string;
  targetBranch?: string;
  sourceBranch: string;
}

export interface IRepositoryInfo {
  organization: string;
  project: string;
  repository: string;
}
export interface IPullRequestInfo extends IRepositoryInfo {
  newSourceBranch: string;
  target?: string;
}

export interface IVaultKey extends IProjectKey {}

export interface IResourceGroupInfo {
  name?: string;
}

export interface IAzureDevOpsLinks {
  _links?: { [x: string]: { href?: string } };
}

export interface IVaultInfo {
  env: 'dev' | 'uat' | 'prd';
  name?: string;
}
export interface IProjectInfo extends IAzureDevOpsLinks {
  id: string;
  name?: string;
  projectName?: string;
  projectId?: string;
  description?: string;
  resourceGroups?: IResourceGroupInfo;
}

export interface IOrganizationInfo extends IAzureDevOpsLinks {
  id?: string;
  name?: string;
  description?: string;
  resourceGroups?: IResourceGroupInfo;
  url?: string
}

export interface IRepositoryInfo extends IAzureDevOpsLinks {
  id: string;
  name?: string;
  defaultBranch?: string;
  vaults?: IVaultInfo[];
}
