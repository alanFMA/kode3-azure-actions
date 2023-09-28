import {
  scaffolderPlugin,
  createScaffolderFieldExtension,
} from '@backstage/plugin-scaffolder';
import { ConfirmationMessage } from './ConfirmationMessage';

export const ConfirmationMessageExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    name: 'ConfirmationMessage',
    component: ConfirmationMessage,
  }),
);
