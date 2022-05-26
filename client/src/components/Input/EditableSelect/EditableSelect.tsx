import React, { useEffect, useRef, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select/base';
import { FieldInputProps, FieldMetaState } from 'react-final-form';
import classnames from 'classnames';

import * as CustomComponents from './EditableCustomComponents';

import { useEffectOnce } from '../../../hooks/general';

import classes from '../styles/EditableSelect.module.scss';

type OptionProps = { value: string; label: string };

export type EditableProps = {
  options: OptionProps[];
  isHigh?: boolean;
  prefix?: string;
  noShadow?: boolean;
  disabled?: boolean;
  hasError?: boolean;
  placeholder?: string;
  input: FieldInputProps<string>;
  meta: FieldMetaState<string>;
  toggleToCustom?: (isCustom: boolean) => void;
};

const EditableSelect: React.FC<EditableProps> = props => {
  const {
    options,
    input,
    placeholder,
    prefix,
    isHigh,
    noShadow,
    disabled,
    hasError,
    toggleToCustom,
    meta,
  } = props;

  const { onChange, value } = input;
  const { initial: initialValue } = meta;

  const [inputValue, setInputValue] = useState<string>('');

  const refOptions: OptionProps[] = useRef(options).current;

  const selectRef = useRef<Select<OptionProps> | null>(null);

  useEffect(() => {
    toggleToCustom &&
      toggleToCustom(
        !refOptions.find((opt: OptionProps) => opt.value === value),
      );
  }, [value, toggleToCustom, refOptions]);

  useEffectOnce(() => {
    if (initialValue != null) {
      setInputValue(initialValue);
    }
  }, [initialValue, onChange]);

  const handleBlur = () => {
    const currentValue = inputValue ? inputValue.trim() : '';
    const optionExists = refOptions.find(
      (opt: OptionProps) => opt.value === currentValue,
    );

    if (!currentValue || optionExists) {
      return;
    }
    onChange(currentValue);
    setInputValue(currentValue);
  };

  const handleInputChange = (
    textInput: string,
    { action }: { action: string },
  ) => {
    if (action === 'input-blur') {
      handleBlur();
    }

    if (action === 'input-change') {
      setInputValue(textInput);
      if (!textInput) onChange(null);
    }
  };

  const handleChange = (newValue: OptionProps) => {
    onChange(newValue ? newValue.value : null);
    setInputValue(newValue ? newValue.value.toString() : '');
  };

  const formatCreate = (createdValue: string) => (
    <span> Set: {createdValue}</span>
  );

  return (
    <CreatableSelect
      ref={selectRef}
      isClearable={true}
      isDisabled={disabled}
      onChange={handleChange}
      onInputChange={handleInputChange}
      options={refOptions}
      formatCreateLabel={formatCreate}
      value={value ? { value, label: value } : null}
      inputValue={inputValue}
      placeholder={placeholder}
      openMenuOnFocus={true}
      openMenuOnClick={true}
      components={{
        IndicatorSeparator: CustomComponents.IndicatorSeparator,
        Menu: CustomComponents.Menu,
        MenuList: CustomComponents.MenuList,
        Option: CustomComponents.Option,
        Placeholder: CustomComponents.Placeholder,
        SingleValue: () => null, // no need this component to avoid double render, we use Input component for that
        ClearIndicator: CustomComponents.ClearIndicator,
        DropdownIndicator: CustomComponents.DropdownIndicator,
        Input: CustomComponents.Input,
      }}
      className={classnames(
        classes.dropdown,
        isHigh && classes.isHigh,
        noShadow && classes.noShadow,
        hasError && classes.hasError,
      )}
      // custom property
      prefix={prefix}
    />
  );
};

export default EditableSelect;
