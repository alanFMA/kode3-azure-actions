import React, { useEffect, useState } from 'react';
import FormControl from '@material-ui/core/FormControl';
import { FormHelperText, InputLabel, NativeSelect } from '@material-ui/core';
import { FieldProps } from '@rjsf/core';

export const Programming = ({
  onChange,
  rawErrors,
  required,
  formData,
  schema,
}: FieldProps<string>) => {
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
  return (
    <FormControl
      margin="normal"
      required={required}
      error={rawErrors?.length > 0 && !formData}
    >
      <InputLabel htmlFor="language-select">Selecione uma linguagem</InputLabel>
      <NativeSelect
        value={formData || ''}
        onChange={e => onChange(e.target.value)}
        inputProps={{
          name: 'language',
          id: 'language-select',
        }}
      >
        <option value="" disabled>
          {' '}
        </option>
        {languages.map((language, index) => (
          <option key={index} value={language}>
            {language}
          </option>
        ))}
      </NativeSelect>
      <FormHelperText>{schema.description}</FormHelperText>
    </FormControl>
  );
};
