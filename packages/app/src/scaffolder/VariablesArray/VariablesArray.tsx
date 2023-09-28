import React, { useState } from 'react';
import { Button, TextField } from '@material-ui/core';
import { FieldProps } from '@rjsf/core';

interface Variable {
  [name: string]: string;
}

export const VariablesArray = ({
  onChange,
  formData,
}: FieldProps<Variable[]>) => {
  const initialVariable: Variable = { name: '', value: '' };
  const [variables, setVariables] = useState(formData || [initialVariable]);

  const handleAddVariable = () => {
    const newVariable: Variable = { name: '', value: '' };
    setVariables([...variables, newVariable]);
    onChange(
      [...variables, newVariable].reduce((acc, cur) => {
        acc[cur.name] = cur.value;
        return acc;
      }, {} as Variable),
    ); // convertendo uma array para um objeto Record<string, string>
  };

  const handleChange = (
    index: number,
    key: keyof Variable,
    newValue: string,
  ) => {
    const updatedVariables = [...variables];
    updatedVariables[index][key] = newValue;
    setVariables(updatedVariables);
    onChange(
      [...updatedVariables].reduce((acc, cur) => {
        acc[cur.name] = cur.value;
        return acc;
      }, {} as Variable),
    ); // Aqui também fazemos a conversão
  };

  return (
    <div>
      <p>Adicione as variáveis</p>
      {variables.map((variable, index) => (
        <div key={index} style={{ marginBottom: '16px' }}>
          <TextField
            style={{ marginRight: '10px' }}
            label="Name"
            variant="outlined"
            value={variable.name}
            onChange={e => handleChange(index, 'name', e.target.value)}
          />
          <TextField
            label="Value"
            variant="outlined"
            value={variable.value}
            onChange={e => handleChange(index, 'value', e.target.value)}
          />
        </div>
      ))}
      <Button variant="contained" color="primary" onClick={handleAddVariable}>
        + Add
      </Button>
    </div>
  );
};
