import {
  scaffolderPlugin,
  createScaffolderFieldExtension,
} from '@backstage/plugin-scaffolder';
import { AzureProjectPicker } from './AzureProjectPicker';

export const AzureProjectPickerExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    name: 'AzureProjectPicker',
    component: AzureProjectPicker,
  }),
);
