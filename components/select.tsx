'use client';

import { useMemo } from 'react';
import { SingleValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';

export interface SelectOption {
  label: string;
  value: string;
}

type Props = {
  onChange: (value?: string) => void;
  onCreate?: (value: string) => void;
  options?: Array<SelectOption>;
  value?: string | null;
  disabled?: boolean;
  placeholder?: string;
}

export const Select = ({
  value,
  onChange,
  onCreate,
  options = [],
  disabled,
  placeholder,
}: Readonly<Props>) => {
  const onSelect = (option: SingleValue<{ label: string; value: string }>) => {
    onChange(option?.value);
  };

  const formattedValue = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  return (
    <CreatableSelect
      placeholder={placeholder}
      className="h-10 text-sm"
      styles={{
        control: (base) => ({
          ...base,
          borderColor: '#e2e8f0',
          ':hover': {
            borderColor: '#e2e8f0',
          },
        }),
      }}
      value={formattedValue}
      onChange={onSelect}
      options={options}
      onCreateOption={onCreate}
      isDisabled={disabled}
    />
  );
};
