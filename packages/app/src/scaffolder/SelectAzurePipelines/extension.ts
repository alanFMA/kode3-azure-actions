import {
  scaffolderPlugin,
  createScaffolderFieldExtension,
} from '@backstage/plugin-scaffolder';
import { SelectAzurePipelines } from './SelectAzurePipelines';

export const SelectAzurePipelinesExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    name: 'SelectAzurePipelines',
    component: SelectAzurePipelines,
  }),
);
