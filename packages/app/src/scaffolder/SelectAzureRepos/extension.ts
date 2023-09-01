import {
  scaffolderPlugin,
  createScaffolderFieldExtension,
} from '@backstage/plugin-scaffolder';
import {
  SelectAzureRepos,
} from './SelectAzureRepos';

export const SelectAzureReposExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    name: 'SelectAzureRepos',
    component: SelectAzureRepos,
  }),
);