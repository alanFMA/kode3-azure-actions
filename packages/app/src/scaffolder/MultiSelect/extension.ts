import {
  scaffolderPlugin,
  createScaffolderFieldExtension,
} from '@backstage/plugin-scaffolder';
import {
  MultiSelect,
} from './MultiSelectExtension';

export const MultiSelectExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    name: 'MultiSelect',
    component: MultiSelect,
  }),
);