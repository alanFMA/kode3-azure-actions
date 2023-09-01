import React, { useEffect, useState } from 'react';
import FormControl from '@material-ui/core/FormControl';
import {
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import { FieldProps } from '@rjsf/core';

export const SelectAzureRepos = ({
  onChange,
  rawErrors,
  required,
  formData,
  schema,
}: FieldProps<string[]>) => {
  const [repos, setRepos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(
      'https://dev.azure.com/kode3tech/kode3-test/_apis/git/repositories?api-version=7.0',
    )
      .then(response => response.json())
      .then(data => {
        setRepos(data.repos);
        setIsLoading(false);
      })
      .catch(error => {
        setFetchError(error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (fetchError) {
    return <p>Error fetching data: {fetchError.message}</p>;
  }

  const handleSelectChange = (selectedValues: string[]) => {
    onChange(selectedValues);
  };

  return (
    <FormControl
      margin="normal"
      required={required}
      error={rawErrors?.length > 0 && !formData}
    >
      <InputLabel htmlFor="repo-select"> </InputLabel>
      <Select
        multiple
        value={formData || []}
        onChange={e => handleSelectChange(e.target.value as string[])}
        inputProps={{
          name: 'repo',
          id: 'repo-select',
        }}
      >
        <MenuItem value="" disabled>
          Selecione um repositório
        </MenuItem>
        {repos.map((repo, index) => (
          <MenuItem key={index} value={repo}>
            {repo}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{schema.description}</FormHelperText>
    </FormControl>
  );
};
