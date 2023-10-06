export interface BackstageConfig {
  app?:          BackstageConfigApp;
  organization?: BackstageConfigOrganization;
  backend?:      BackstageConfigBackend;
  proxy?:        BackstageConfigProxy;
  integrations?: BackstageConfigIntegrations;
  techdocs?:     BackstageConfigTechdocs;
  scaffolder?:   BackstageConfigScaffolder;
  auth?:         BackstageConfigAuth;
  catalog?:      BackstageConfigCatalog;
}

export interface BackstageConfigApp {
  title?:   string;
  baseUrl?: string;
}

export interface BackstageConfigAuth {
  environment?: string;
  providers?:   BackstageConfigProviders;
}

export interface BackstageConfigProviders {
  microsoft?: BackstageConfigMicrosoft;
}

export interface BackstageConfigMicrosoft {
  development?: BackstageConfigDevelopment;
  production?: BackstageConfigDevelopment;
}


export interface TLSOptions {
}


export interface BackstageConfigDevelopment {
  clientId?:     string;
  clientSecret?: string;
  tenantId?:     string;
}

export interface BackstageConfigBackend {
  baseUrl?:                string;
  listen?:                 string;
  customActionBackendUrl?: string;
  cache?:                  BackstageConfigCache;
  csp?:                    BackstageConfigCSP;
  cors?:                   BackstageConfigCors;
  reading?:                BackstageConfigReading;
  database?:               BackstageConfigDatabase;
}

export interface BackstageConfigCache {
  store?: string;
}

export interface BackstageConfigCors {
  origin?:      string;
  methods?:     string[];
  credentials?: boolean;
}

export interface BackstageConfigCSP {
  "connect-src"?: string[];
}

export interface BackstageConfigDatabase {
  client?:     string;
  connection?: BackstageConfigConnection;
}

export interface BackstageConfigConnection {
  host?:     string;
  database?: string;
  user?:     string;
  port?:     string;
  password?: string;
}

export interface BackstageConfigReading {
  allow?: BackstageConfigAllow[];
}

export interface BackstageConfigAllow {
  host?: string;
}

export interface BackstageConfigCatalog {
  rules?:     BackstageConfigRule[];
  locations?: Location[];
}

export interface BackstageConfigLocation {
  type?:   string;
  target?: string;
  rules?:  BackstageConfigRule[];
}

export interface BackstageConfigRule {
  allow?: string[];
}

export interface BackstageConfigIntegrations {
  azure?: BackstageConfigAzureElement[];
}


export interface BackstageConfigAzureElement {
  host?:  string;
  token?: string;
  organization?: string;
}

export interface BackstageConfigOrganization {
  name?: string;
}

export interface BackstageConfigProxy {
  "/sonarqube"?: BackstageConfigSonarqube;
}

export interface BackstageConfigSonarqube {
  target?:         string;
  allowedMethods?: string[];
  cors?:           boolean;
  headers?:        Headers;
}

export interface BackstageConfigHeaders {
  Authorization?: string;
}

export interface BackstageConfigScaffolder {
  azure?: BackstageConfigScaffolderAzure;
}

export interface BackstageConfigScaffolderAzure {
  baseUrl?: string;
  api?:     BackstageConfigAPI;
}

export interface BackstageConfigAPI {
  token?: string;
}

export interface BackstageConfigTechdocs {
  builder?:   string;
  generator?: Generator;
  publisher?: BackstageConfigPublisher;
}

export interface BackstageConfigGenerator {
  runIn?: string;
}

export interface BackstageConfigPublisher {
  type?:             string;
  azureBlobStorage?: BackstageConfigAzureBlobStorage;
}

export interface BackstageConfigAzureBlobStorage {
  containerName?: string;
  credentials?:   BackstageConfigCredentials;
}

export interface BackstageConfigCredentials {
  accountName?: string;
  accountKey?:  string;
}
