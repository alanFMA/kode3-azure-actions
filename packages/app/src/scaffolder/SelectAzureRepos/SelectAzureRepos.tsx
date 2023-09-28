import React, { useEffect, useState } from 'react';
import FormControl from '@material-ui/core/FormControl';
import {
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import { FieldProps } from '@rjsf/core';
import { useApi } from '@backstage/core-plugin-api';
import { proxyAzurePluginApiRef } from '../../plugins/azure-devops-apiref';

interface Repo {
  id: string;
  name: string;
}

export const SelectAzureRepos = ({
  onChange,
  rawErrors,
  required,
  formData,
  schema,
}: FieldProps<string[]>) => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<Error | null>(null);
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]); // Rastreie os repositórios selecionados
  const azureAPI = useApi(proxyAzurePluginApiRef);

  useEffect(() => {
    azureAPI
      .repositories('kode3tech', 'kode3-test')
      .then(data => {
        setRepos(data);
        setIsLoading(false);
      })
      .catch(error => {
        setFetchError(error);
        setIsLoading(false);
      });
  }, [azureAPI]);

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  if (fetchError) {
    return <p>Erro ao buscar dados: {fetchError.message}</p>;
  }

  const handleSelectChange = (selectedValues: string[]) => {
    const values: Repo[] = selectedValues.map(v => JSON.parse(v));
    const selectedRepoIds = values
      .map(value => {
        const selectedRepo: Repo = repos.find(
          repo => repo.name === value.name,
        )!;
        return JSON.stringify(
          { name: selectedRepo.name, id: selectedRepo.id },
          null,
          2,
        );
      })
      .filter(Boolean) as string[];

    setSelectedRepos(selectedValues);

    onChange(selectedRepoIds);
  };

  const hasError = required && selectedRepos.length === 0;

  return (
    <FormControl
      margin="normal"
      required={required}
      error={rawErrors?.length > 0 || hasError}
    >
      <InputLabel htmlFor="repo-select"> </InputLabel>
      <Select
        multiple
        value={selectedRepos} // Use selectedRepos em vez de formData
        onChange={e => handleSelectChange(e.target.value as string[])}
        inputProps={{
          id: 'repo_id',
          name: 'repo',
        }}
      >
        <MenuItem value="" disabled>
          {' '}
        </MenuItem>
        {repos.map((repo, repo_id) => (
          <MenuItem key={repo_id} value={JSON.stringify(repo)}>
            {repo.name}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{schema.description}</FormHelperText>
    </FormControl>
  );
};
