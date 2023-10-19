import React, { useEffect, useState } from 'react';
import FormControl from '@material-ui/core/FormControl';
import {
  FormHelperText,
  InputLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField, // Adicione o import para o TextField
} from '@material-ui/core';
import { FieldProps } from '@rjsf/core';
import { useApi } from '@backstage/core-plugin-api';
import { proxyAzurePluginApiRef } from '../../plugins/azure-devops-apiref';

interface VariableGroup {
  id: string;
  name: string;
}

export const SelectAzureVariableGroups = ({
  onChange,
  rawErrors,
  required,
  formData,
  formContext,
  schema,
}: FieldProps<string[]>) => {
  const [variableGroups, setVariableGroups] = useState<VariableGroup[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<Error | null>(null);
  const [selectedVariableGroups, setSelectedVariableGroups] = useState<
    string[]
  >([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const azureAPI = useApi(proxyAzurePluginApiRef);

  useEffect(() => {
    const { org, owner } = formContext.formData;
    if (org && owner) {
      azureAPI
        .variableGroups(org, owner)
        .then(data => {
          setVariableGroups(data);
          setIsLoading(false);
        })
        .catch(error => {
          setFetchError(error);
          setIsLoading(false);
        });
    } else {
      setVariableGroups([]);
      setIsLoading(false);
    }
  }, [azureAPI, formContext.formData]);

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  if (fetchError) {
    return <p>Erro ao buscar dados: {fetchError.message}</p>;
  }

  const handleCheckboxChange = (variableGroupId: string) => {
    const isSelected = selectedVariableGroups.includes(variableGroupId);
    let updatedVariableGroups: string[] = [];

    if (isSelected) {
      updatedVariableGroups = selectedVariableGroups.filter(
        id => id !== variableGroupId,
      );
    } else {
      updatedVariableGroups = [...selectedVariableGroups, variableGroupId];
    }

    const selectedVariableGroupData = updatedVariableGroups
      .map(id => {
        const selectedVariableGroup = variableGroups.find(
          variableGroup => variableGroup.id === id,
        );
        return selectedVariableGroup
          ? JSON.stringify({
              name: selectedVariableGroup.name,
              id: selectedVariableGroup.id,
            })
          : null;
      })
      .filter(Boolean);

    setSelectedVariableGroups(updatedVariableGroups);
    onChange(selectedVariableGroupData);
  };

  const hasError = required && selectedVariableGroups.length === 0;

  const filteredVariableGroups = variableGroups.filter(variableGroup =>
    variableGroup.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <FormControl
      margin="normal"
      required={required}
      error={rawErrors?.length > 0 || hasError}
    >
      <TextField
        label="Pesquisar por nome"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        variant="outlined"
        fullWidth
      />
      <InputLabel
        htmlFor="pipeline-select"
        style={{
          position: 'absolute',
          top: '-50px',
          left: '0px',
        }}
      >
        Grupos de Variáveis.
      </InputLabel>
      <FormGroup>
        {filteredVariableGroups.map(variableGroup => (
          <FormControlLabel
            key={variableGroup.id}
            control={
              <Checkbox
                checked={selectedVariableGroups.includes(variableGroup.id)}
                onChange={() => handleCheckboxChange(variableGroup.id)}
                name={variableGroup.name}
              />
            }
            label={variableGroup.name}
          />
        ))}
      </FormGroup>
      <FormHelperText>{schema.description}</FormHelperText>
    </FormControl>
  );
};
