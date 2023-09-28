import React from 'react';
import { FieldExtensionComponentProps } from '@backstage/plugin-scaffolder-react';

export const ConfirmationMessage = ({
  onChange,
  rawErrors,
  formData,
  formContext,
  schema: { description, title },
}: FieldExtensionComponentProps<string, {}>) => {
  return <strong style={{ marginTop: '-10px' }}>{description}</strong>;
};
