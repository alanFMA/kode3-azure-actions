import React, { useEffect, useState } from 'react';
import FormControl from '@material-ui/core/FormControl';
import {
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import { FieldProps } from '@rjsf/core';

export const MultiSelect = ({
  onChange,
  rawErrors,
  required,
  formData,
  schema,
}: FieldProps<string[]>) => {
  const [languages, setLanguages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<Error | null>(null);

  useEffect(() => {
    fetch('https://mocki.io/v1/3ad11462-46c9-473a-a281-b40f2a05a6b6')
      .then(response => response.json())
      .then(data => {
        setLanguages(data.languages);
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
      <InputLabel htmlFor="language-select"> </InputLabel>
      <Select
        multiple
        value={formData || []}
        onChange={e => handleSelectChange(e.target.value as string[])}
        inputProps={{
          name: 'language',
          id: 'language-select',
        }}
      >
        <MenuItem value="" disabled>
          Selecione uma linguagem
        </MenuItem>
        {languages.map((language, index) => (
          <MenuItem key={index} value={language}>
            {language}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{schema.description}</FormHelperText>
    </FormControl>
  );
};
