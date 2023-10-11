import React from 'react';
import { Navigate, Route } from 'react-router';
import { apiDocsPlugin, ApiExplorerPage } from '@backstage/plugin-api-docs';
import {
  CatalogEntityPage,
  CatalogIndexPage,
  catalogPlugin,
} from '@backstage/plugin-catalog';
import {
  CatalogImportPage,
  catalogImportPlugin,
} from '@backstage/plugin-catalog-import';
import {
  ScaffolderFieldExtensions,
  ScaffolderPage,
  scaffolderPlugin,
} from '@backstage/plugin-scaffolder';
import { orgPlugin } from '@backstage/plugin-org';
import { SearchPage } from '@backstage/plugin-search';
import { TechRadarPage } from '@backstage/plugin-tech-radar';
import {
  TechDocsIndexPage,
  techdocsPlugin,
  TechDocsReaderPage,
} from '@backstage/plugin-techdocs';
import { UserSettingsPage } from '@backstage/plugin-user-settings';
import { apis } from './apis';
import { entityPage } from './components/catalog/EntityPage';
import { searchPage } from './components/search/SearchPage';
import { Root } from './components/Root';

import {
  AlertDisplay,
  OAuthRequestDialog,
  SignInProviderConfig,
  SignInPage,
} from '@backstage/core-components';
import { createApp } from '@backstage/app-defaults';
import { FlatRoutes } from '@backstage/core-app-api';
import { CatalogGraphPage } from '@backstage/plugin-catalog-graph';
import { PermissionedRoute } from '@backstage/plugin-permission-react';
import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common/alpha';
import { microsoftAuthApiRef } from '@backstage/core-plugin-api';
import { MultiSelectExtension } from './scaffolder/MultiSelect';
import { ProgrammingExtension } from './scaffolder/Programming';
import { ValidateKebabCaseFieldExtension } from './scaffolder/ValidateKebabCase';
import { SelectAzureReposExtension } from './scaffolder/SelectAzureRepos';
import { DynamicPickerExtension } from './scaffolder/DynamicPicker/DynamicPicker';
import { SelectAzurePipelinesExtension } from './scaffolder/SelectAzurePipelines';
import { ConfirmationMessageExtension } from './scaffolder/ConfirmationMessage';
import { SelectAzureVariableGroupsExtension } from './scaffolder/SelectAzureVariableGroups';
import { VariablesArrayExtension } from './scaffolder/VariablesArray';
import { MypluginPage } from '@internal/plugin-myplugin';
import { AzureOrganizationPickerExtension } from './scaffolder/AzureOrganizationPicker';
import { AzureProjectPickerExtension } from './scaffolder/AzureProjectPicker';

const microsoftAuthProvider: SignInProviderConfig = {
  id: 'azure-auth-provider',
  title: 'Microsoft Active Directory',
  message:
    'Sign in to Backstage Application using your Active Directory account.',
  apiRef: microsoftAuthApiRef,
};

const app = createApp({
  apis,
  components: {
    SignInPage: props => (
      <SignInPage {...props} auto provider={microsoftAuthProvider} />
    ),
  },
  bindRoutes({ bind }) {
    bind(catalogPlugin.externalRoutes, {
      createComponent: scaffolderPlugin.routes.root,
      viewTechDoc: techdocsPlugin.routes.docRoot,
    });
    bind(apiDocsPlugin.externalRoutes, {
      registerApi: catalogImportPlugin.routes.importPage,
    });
    bind(scaffolderPlugin.externalRoutes, {
      registerComponent: catalogImportPlugin.routes.importPage,
    });
    bind(orgPlugin.externalRoutes, {
      catalogIndex: catalogPlugin.routes.catalogIndex,
    });
  },
});

const AppProvider = app.getProvider();
const AppRouter = app.getRouter();

const routes = (
  <FlatRoutes>
    <Navigate key="/" to="catalog" />
    <Route path="/catalog" element={<CatalogIndexPage />} />
    <Route
      path="/catalog/:namespace/:kind/:name"
      element={<CatalogEntityPage />}
    >
      {entityPage}
    </Route>
    <Route path="/docs" element={<TechDocsIndexPage />} />
    <Route
      path="/docs/:namespace/:kind/:name/*"
      element={<TechDocsReaderPage />}
    />
    <Route path="/create" element={<ScaffolderPage />}>
      <ScaffolderFieldExtensions>
        <DynamicPickerExtension />
        <ValidateKebabCaseFieldExtension />
        <ProgrammingExtension />
        <MultiSelectExtension />
        <SelectAzureReposExtension />
        <SelectAzurePipelinesExtension />
        <ConfirmationMessageExtension />
        <SelectAzureVariableGroupsExtension />
        <VariablesArrayExtension />
        <AzureOrganizationPickerExtension />
        <AzureProjectPickerExtension />
      </ScaffolderFieldExtensions>
    </Route>
    <Route path="/api-docs" element={<ApiExplorerPage />} />
    <Route
      path="/tech-radar"
      element={<TechRadarPage width={1500} height={800} />}
    />
    <PermissionedRoute
      path="/catalog-import"
      permission={catalogEntityCreatePermission}
      element={<CatalogImportPage />}
    />
    <Route path="/search" element={<SearchPage />}>
      {searchPage}
    </Route>
    <Route path="/settings" element={<UserSettingsPage />} />
    <Route path="/catalog-graph" element={<CatalogGraphPage />} />
    <Route path="/myplugin" element={<MypluginPage />} />
  </FlatRoutes>
);

const App = () => (
  <AppProvider>
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <Root>{routes}</Root>
    </AppRouter>
  </AppProvider>
);

export default App;
