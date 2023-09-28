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

interface Pipeline {
  id: string;
  name: string;
}

export const SelectAzurePipelines = ({
  onChange,
  rawErrors,
  required,
  formData,
  schema,
}: FieldProps<string[]>) => {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<Error | null>(null);
  const [selectedPipelines, setSelectedPipelines] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(''); // Adicione o estado searchTerm
  const azureAPI = useApi(proxyAzurePluginApiRef);

  useEffect(() => {
    azureAPI
      .pipelines('kode3tech', 'kode3-test')
      .then(data => {
        setPipelines(data);
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

  const handleCheckboxChange = (pipelineId: string) => {
    const isSelected = selectedPipelines.includes(pipelineId);
    let updatedPipelines: string[] = [];

    if (isSelected) {
      updatedPipelines = selectedPipelines.filter(id => id !== pipelineId);
    } else {
      updatedPipelines = [...selectedPipelines, pipelineId];
    }

    const selectedPipelineData = updatedPipelines
      .map(id => {
        const selectedPipeline = pipelines.find(pipeline => pipeline.id === id);
        return selectedPipeline
          ? JSON.stringify({
              name: selectedPipeline.name,
              id: selectedPipeline.id,
            })
          : null;
      })
      .filter(Boolean);

    setSelectedPipelines(updatedPipelines);
    onChange(selectedPipelineData);
  };

  const hasError = required && selectedPipelines.length === 0;

  const filteredPipelines = pipelines.filter(pipeline =>
    pipeline.name.toLowerCase().includes(searchTerm.toLowerCase()),
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
        Selecione a(s) pipeline(s) para exclusão.
      </InputLabel>
      <FormGroup>
        {filteredPipelines.map(pipeline => (
          <FormControlLabel
            key={pipeline.id}
            control={
              <Checkbox
                checked={selectedPipelines.includes(pipeline.id)}
                onChange={() => handleCheckboxChange(pipeline.id)}
                name={pipeline.name}
              />
            }
            label={pipeline.name}
          />
        ))}
      </FormGroup>
      <FormHelperText>{schema.description}</FormHelperText>
    </FormControl>
  );
};
