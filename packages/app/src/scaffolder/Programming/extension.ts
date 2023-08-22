import {
  scaffolderPlugin,
  createScaffolderFieldExtension,
} from '@backstage/plugin-scaffolder';
import {
  Programming,
} from './ProgrammingExtension';

export const ProgrammingExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    name: 'Programming',
    component: Programming,
  }),
);