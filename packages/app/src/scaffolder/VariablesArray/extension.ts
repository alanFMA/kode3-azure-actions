import {
  scaffolderPlugin,
  createScaffolderFieldExtension,
} from '@backstage/plugin-scaffolder';
import { VariablesArray } from './VariablesArray';

export const VariablesArrayExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    name: 'VariablesArray',
    component: VariablesArray,
  }),
);
