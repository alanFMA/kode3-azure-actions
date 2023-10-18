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
  Project,
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
export const AzureProjectPicker = ({
  rawErrors,
  onChange,
  schema: { description, title },
  uiSchema: { 'ui:options': uiOptions },
  formData,
  formContext,
}: FieldExtensionComponentProps<
  string,
  { organizationRef?: string; projectNameFilter?: string }
>) => {
  const { organizationRef, projectNameFilter } = {
    organizationRef: 'organization',
    projectNameFilter: '.+',
    ...(uiOptions ?? {}),
  };

  const organization =
    formContext.formData[organizationRef ?? 'organization'] ?? '';

  const azureApi = useApi(proxyAzurePluginApiRef);
  const classes = useStyles();

  const [project, setProject] = useState<string>(formData ?? '');

  const [fetchedProjects, setFetchedProjects] = useState<Project[]>([]);

  const projectItems: SelectItem[] = fetchedProjects
    ? fetchedProjects.map(i => ({ label: i.projectName, value: i.projectId }))
    : [{ label: 'Loading...', value: 'loading' }];

  useEffect(() => {
    if (organization && fetchedProjects?.length === 0) {
      azureApi.allowedProjects(organization).then(projs => {
        if (projs && projs.length > 0) {
          const filtered = projs.filter(p =>
            RegExp(projectNameFilter).test(p.projectName),
          );
          setFetchedProjects([...filtered]);
          setProject(project || filtered[0].projectName);
          onChange(project || filtered[0].projectName);
        }
      });
    }
  }, [
    setProject,
    project,
    azureApi,
    fetchedProjects,
    setFetchedProjects,
    organization,
    onChange,
    projectNameFilter,
  ]);

  return (
    <>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="az-repourl-proj-picker-label">Project</InputLabel>
        <Select
          labelId="az-repourl-proj-picker-label"
          id="az-repourl-proj-picker"
          value={project}
          onChange={e => {
            onChange(e.target.value);
            setProject(String(e.target.value));
          }}
          disabled={projectItems.length === 1}
          label="Project"
          required
          error={rawErrors?.length > 0 && !project}
        >
          {projectItems?.map((i, index) => {
            return (
              <MenuItem key={index} value={i.label}>
                <span>{i.label}</span>
              </MenuItem>
            );
          })}
        </Select>
        <FormHelperText>
          <div dangerouslySetInnerHTML={{ __html: description ?? '' }} />
        </FormHelperText>
        <LinearProgress hidden={fetchedProjects?.length !== 0} />
      </FormControl>
    </>
  );
};
