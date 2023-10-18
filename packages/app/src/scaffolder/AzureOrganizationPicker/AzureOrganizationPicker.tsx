/*
 * Copyright 2021 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';

import { SelectItem } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { FieldExtensionComponentProps } from '@backstage/plugin-scaffolder-react';
import { FormHelperText } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import LinearProgress from '@material-ui/core/LinearProgress';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import {
  Organization,
  proxyAzurePluginApiRef,
} from '../../plugins/azure-devops-apiref';

const useStyles = makeStyles(theme => ({
  formControl: {
    minWidth: '100%',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  subheader: {
    fontSize: '1.5em',
    color: 'black',
  },
  root: {
    width: '100%',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  subHeaderIconMargin: {
    marginRight: '5px',
  },
  projectItemMargin: {
    marginLeft: '48px',
  },
}));
export const AzureOrganizationPicker = ({
  rawErrors,
  onChange,
  schema: { description, title },
  formData,
}: FieldExtensionComponentProps<string, any>) => {
  const azureApi = useApi(proxyAzurePluginApiRef);
  const classes = useStyles();

  const [organization, setOrganization] = useState<string>(formData ?? '');
  const [fetchedOrganizations, setFetchedOrganizations] = useState<
    Organization[]
  >([]);

  useEffect(() => {
    onChange(organization);
  }, [organization, onChange]);

  const organizationItems: SelectItem[] = fetchedOrganizations
    ? fetchedOrganizations.map(i => ({ label: i.name, value: i.id }))
    : [{ label: 'Loading...', value: 'loading' }];

  useEffect(() => {
    if (fetchedOrganizations?.length === 0) {
      azureApi.allowedOrganizations().then(orgs => {
        if (orgs && orgs.length > 0) {
          setFetchedOrganizations([...orgs]);
          setOrganization(organization || orgs[0].name);
        }
      });
    }
  }, [
    setOrganization,
    organization,
    azureApi,
    fetchedOrganizations,
    setFetchedOrganizations,
  ]);

  return (
    <>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="az-repourl-org-picker-label">{title}</InputLabel>
        <Select
          labelId="az-repourl-org-picker-label"
          id="az-repourl-org-picker"
          value={organization}
          onChange={e => {
            onChange(e.target.value);
            setOrganization(String(e.target.value));
          }}
          disabled={organizationItems.length === 1}
          label="Organization"
          required
          error={rawErrors?.length > 0 && !organization}
        >
          {organizationItems?.map((i, index) => {
            return (
              <MenuItem key={index} value={i.label}>
                <span>{i.label}</span>
              </MenuItem>
            );
          })}
        </Select>
        <FormHelperText>{description}</FormHelperText>
        <LinearProgress hidden={fetchedOrganizations?.length !== 0} />
      </FormControl>
    </>
  );
};
