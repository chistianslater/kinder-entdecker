import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormData } from '../../types';

interface TypeSelectorProps {
  form: UseFormReturn<FormData>;
  onChange?: (value: string[]) => void;
}

export function TypeSelector({ form, onChange }: TypeSelectorProps) {
  const { register, watch } = form;
  const selectedTypes = watch('type');

  const handleTypeChange = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];

    if (onChange) {
      onChange(newTypes);
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="text-white">Aktivitätstypen</h4>
      <div className="flex flex-wrap gap-2">
        {['Outdoor', 'Indoor', 'Sport', 'Kultur', 'Essen'].map((type) => (
          <label key={type} className="flex items-center">
            <input
              type="checkbox"
              value={type}
              {...register('type')}
              checked={selectedTypes.includes(type)}
              onChange={() => handleTypeChange(type)}
              className="mr-2 text-white bg-accent border-accent"
            />
            <span className="text-white">{type}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
