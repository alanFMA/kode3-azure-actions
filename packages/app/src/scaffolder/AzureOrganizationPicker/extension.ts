import {
  scaffolderPlugin,
  createScaffolderFieldExtension,
} from '@backstage/plugin-scaffolder';
import { AzureOrganizationPicker } from './AzureOrganizationPicker';

export const AzureOrganizationPickerExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    name: 'AzureOrganizationPicker',
    component: AzureOrganizationPicker,
  }),
);
