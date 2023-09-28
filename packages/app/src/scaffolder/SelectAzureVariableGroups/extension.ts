import {
  scaffolderPlugin,
  createScaffolderFieldExtension,
} from '@backstage/plugin-scaffolder';
import { SelectAzureVariableGroups } from './SelectAzureVariableGroups';

export const SelectAzureVariableGroupsExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    name: 'SelectAzureVariableGroups',
    component: SelectAzureVariableGroups,
  }),
);
