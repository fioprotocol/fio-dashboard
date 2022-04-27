import React, { useEffect, useRef, useState } from 'react';
import { Props as OptionProps } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select/base';
import { FieldRenderProps } from 'react-final-form';
import classnames from 'classnames';

import * as CustomComponents from './EditableCustomComponents';

import classes from '../styles/EditableSelect.module.scss';

export type EditableProps = {
  options: OptionProps[];
  isHigh?: boolean;
  prefix?: string;
  noShadow?: boolean;
  disabled?: boolean;
  hasError?: boolean;
  toggleToCustom?: (isCustom: boolean) => void;
  initialValues?: string;
};

const EditableSelect: React.FC<FieldRenderProps<EditableProps>> = props => {
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
    initialValues,
  } = props;

  const [inputValue, setInputValue] = useState('');

  const refOptions = useRef(options).current;

  const selectRef = useRef<Select<{
    value: EditableProps;
    label: EditableProps;
  }> | null>(null);

  const { onChange, value } = input;

  useEffect(() => {
    toggleToCustom &&
      toggleToCustom(
        !refOptions.find((opt: OptionProps) => opt.value === value),
      );
  }, [value]);

  useEffect(() => {
    if (initialValues != null) {
      onChange(initialValues);
      setInputValue(initialValues);
    }
  }, [initialValues]);

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

  const handleChange = (newValue: {
    value: EditableProps;
    label: EditableProps;
  }) => {
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
        SingleValue: singleValueProps =>
          CustomComponents.SingleValue(singleValueProps, prefix),
        ClearIndicator: CustomComponents.ClearIndicator,
        DropdownIndicator: CustomComponents.DropdownIndicator,
        Input: inputProps => CustomComponents.Input(inputProps, prefix),
      }}
      className={classnames(
        classes.dropdown,
        isHigh && classes.isHigh,
        noShadow && classes.noShadow,
        hasError && classes.hasError,
      )}
    />
  );
};

export default EditableSelect;
