import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  forceReset?: boolean;
  loading?: boolean;
  upperCased?: boolean;
  onBlur?: (fieldName: string) => void;
  onClear?: () => void;
  onInputChange?: (chainCodeValue: string) => Promise<void> | void;
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
    meta,
    forceReset,
    loading,
    upperCased,
    onBlur,
    onClear,
    onInputChange,
    toggleToCustom,
  } = props;

  const { onChange, value, name } = input;
  const { initial: initialValue } = meta;

  const [inputValue, setInputValue] = useState<string>('');

  const refOptions: OptionProps[] = options;

  const selectRef = useRef<Select<OptionProps> | null>(null);

  const convertValue = useCallback(
    (value?: string) => {
      if (value && upperCased) return value.toUpperCase();

      return value;
    },
    [upperCased],
  );

  const onFormChangeWithConvertedValue = useCallback(
    (value?: string) => onChange(convertValue(value)),
    [convertValue, onChange],
  );
  const setInputConvertedValue = useCallback(
    (value?: string) => setInputValue(convertValue(value)),
    [convertValue],
  );
  const handleFormAndInputChange = useCallback(
    (value?: string) => {
      onFormChangeWithConvertedValue(value);
      setInputConvertedValue(value);
    },
    [onFormChangeWithConvertedValue, setInputConvertedValue],
  );

  useEffect(() => {
    toggleToCustom &&
      toggleToCustom(
        !refOptions.find((opt: OptionProps) => opt.value === value),
      );
  }, [value, toggleToCustom, refOptions]);

  useEffectOnce(() => {
    if (initialValue != null) {
      setInputConvertedValue(initialValue);
    }
  }, [initialValue, setInputConvertedValue]);

  useEffect(() => {
    if (forceReset) {
      handleFormAndInputChange('');
    }
  }, [forceReset, handleFormAndInputChange]);

  // Handle dropdown value when we programaticaly filled form field.
  useEffect(() => {
    if (value && !inputValue) {
      setInputConvertedValue(value);
    }
  }, [value, inputValue, setInputConvertedValue]);

  const handleBlur = () => {
    const currentValue = inputValue ? inputValue.trim() : '';
    onBlur && onBlur(name);

    if (!currentValue) return;

    handleFormAndInputChange(currentValue);
  };

  const handleInputChange = (
    textInput: string,
    { action }: { action: string },
  ) => {
    if (action === 'input-blur') {
      handleBlur();
    }

    if (action === 'input-change') {
      setInputConvertedValue(textInput);
      onInputChange && onInputChange(convertValue(textInput));
      if (!textInput) onFormChangeWithConvertedValue(null);
    }
  };

  const handleChange = (
    newValue: OptionProps,
    { action }: { action: string },
  ) => {
    handleFormAndInputChange(newValue ? newValue.value.toString() : '');

    if (action === 'clear') {
      onClear && onClear();
    }
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
      noOptionsMessage={e => (e.inputValue ? 'No options' : null)}
      isLoading={loading}
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
        Control: CustomComponents.Control,
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
