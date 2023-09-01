import React, { useCallback, useEffect, useState } from 'react';
import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { FormControl, TextField, Typography } from '@material-ui/core';
import { useQuery } from 'react-query';
import {
  createScaffolderFieldExtension,
  FieldExtensionComponentProps,
} from '@backstage/plugin-scaffolder-react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import axios from 'axios';
import getDeepAttributeInObject from './getDeepAttributeInObject';

const TextValuePicker = (
  props: FieldExtensionComponentProps<
    React.ReactNode,
    {
      valueKey: string;
      labelKey: string;
      url: string;
      backendPath?: string;
      formContextDependencies?: string[];
    }
  >,
) => {
  const {
    onChange,
    required,
    schema: { title, description },
    rawErrors,
    formData,
    uiSchema,
    idSchema,
    placeholder,
    formContext,
    name,
  } = props;

  const configApi = useApi(configApiRef);

  const valueKey = uiSchema['ui:options']?.valueKey;
  const labelKey = uiSchema['ui:options']?.labelKey;
  const urlPath = uiSchema['ui:options']?.url;
  const multiple = (uiSchema['ui:options']?.multiple as boolean) || false;
  const formContextDependencies =
    uiSchema['ui:options']?.formContextDependencies;
  const hasAllDependencies = formContextDependencies?.every(key =>
    getDeepAttributeInObject(formContext.formData, key),
  );

  const finalUrl = `${configApi.getString('backend.baseUrl')}/${urlPath}`;

  const onSelect = useCallback(
    (_: any, value: string | string[] | null) => {
      // @ts-ignore
      onChange(value ?? undefined);
    },
    [onChange],
  );

  const parseUrl = (
    requestUrl: string,
    keys: string[],
    dict: Record<string, string | undefined>,
  ) => {
    let newUrl = requestUrl;
    for (const key of keys) {
      if (getDeepAttributeInObject(dict, key)) {
        newUrl = newUrl.replace(
          `{${key}}`,
          getDeepAttributeInObject(dict, key) as string,
        );
      }
    }
    return newUrl;
  };

  const handleRequest = async () => {
    const newUrl = parseUrl(
      finalUrl!,
      formContextDependencies || [],
      formContext.formData,
    );
    const response = await axios.get(newUrl);
    return response.data;
  };

  const result = useQuery<Record<string, any>>(
    [
      finalUrl,
      ...(formContextDependencies || []).map(dep =>
        getDeepAttributeInObject(formContext.formData, dep),
      ),
    ],
    handleRequest,
    {
      enabled: !formContextDependencies || hasAllDependencies,
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 5,
      retry: 0,
      keepPreviousData: true,
    },
  );

  useEffect(() => {
    if (
      formContextDependencies &&
      !formContextDependencies.some(fcd =>
        getDeepAttributeInObject(formContext.formData, fcd),
      )
    ) {
      onChange(undefined);
    }
  }, [formContext.formData, formContextDependencies, onChange]);

  return (
    <FormControl
      margin="normal"
      required={required}
      error={rawErrors?.length > 0 && !formData}
    >
      <Autocomplete
        // @ts-ignore
        disabled={
          result.isLoading || (formContextDependencies && !hasAllDependencies)
        }
        id={idSchema?.$id}
        value={formData || (multiple ? [] : '')}
        loading={result.isLoading}
        onChange={onSelect}
        options={
          result.data?.map(obj => (valueKey ? obj[valueKey] : obj)) ?? []
        }
        getOptionLabel={option => {
          const responseDataOption = result.data?.find(obj => {
            if (typeof option === 'object') {
              return JSON.stringify(option) === JSON.stringify(obj);
            }
            return (valueKey ? obj[valueKey] : obj) === option;
          });
          return responseDataOption ? responseDataOption[labelKey!] : '';
        }}
        // getOptionSelected
        autoSelect
        multiple={multiple}
        freeSolo={
          (uiSchema['ui:options']?.allowArbitraryValues as boolean) ?? false
        }
        renderInput={params => (
          <TextField
            {...params}
            label={title}
            margin="dense"
            helperText={description}
            FormHelperTextProps={{ margin: 'dense', style: { marginLeft: 0 } }}
            variant="outlined"
            required={required}
            InputProps={params.InputProps}
          />
        )}
      />
      {result.error && (
        <Typography color="error">
          {
            // @ts-ignore
            result.error.response?.data?.error?.message
              ? JSON.stringify(result.error?.response?.data?.error?.message)
              : 'Error on fetch select options'
          }
        </Typography>
      )}
    </FormControl>
  );
};

export const DynamicPickerExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    name: 'DynamicPicker',
    component: TextValuePicker,
  }),
);
