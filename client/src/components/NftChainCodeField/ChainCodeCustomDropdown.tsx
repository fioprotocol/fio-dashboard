import React, { useState, useRef } from 'react';
import { FieldRenderProps } from 'react-final-form';
import CreatableSelect from 'react-select/creatable';
import { components, OnChangeValue, Props as OptionProps } from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import classnames from 'classnames';

import classes from './styles.module.scss';

type Option = {
  value: OptionProps;
  label: OptionProps;
};

type Props = {
  options: Option[];
  isHigh?: boolean;
  prefix?: string;
  noShadow?: boolean;
  disabled?: boolean;
};

const Input = (props: any) => <components.Input {...props} isHidden={false} />;

const ChainCodeCustomDropdown: React.FC<FieldRenderProps<Props>> = props => {
  const {
    input,
    options,
    placeholder,
    prefix,
    isHigh,
    noShadow,
    disabled,
  } = props;
  const { onChange, value } = input;
  const [inputValue, setInputValue] = useState('');

  const selectRef = useRef(null);

  const handleBlur = () => {
    const currentValue = inputValue ? inputValue.trim() : '';
    const optionExists = options.find(
      (opt: Option) => opt.value === currentValue,
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
    if (action === 'input-change') {
      setInputValue(textInput);
    }
    if (action === 'input-blur') {
      handleBlur();
    }
  };

  const handleChange = (newValue: OnChangeValue<Option, false>) => {
    onChange(newValue ? newValue.value : null);
    setInputValue(newValue ? newValue.value.toString() : '');
  };

  const onFocus = () =>
    value && selectRef && selectRef.current.inputRef.select();

  const formatCreate = (inputValue: string) => <span> Set: {inputValue}</span>;

  return (
    <CreatableSelect
      ref={selectRef}
      isClearable={true}
      isDisabled={disabled}
      onChange={handleChange}
      onFocus={onFocus}
      onInputChange={handleInputChange}
      options={options}
      formatCreateLabel={formatCreate}
      value={value ? { value, label: value } : null}
      placeholder={placeholder}
      components={{
        IndicatorSeparator: () => null,
        Menu: props => <components.Menu {...props} className={classes.menu} />,
        MenuList: props => (
          <components.MenuList {...props} className={classes.menuList} />
        ),
        Option: props => {
          const { isSelected } = props;
          return (
            <components.Option
              {...props}
              className={classnames(
                classes.option,
                isSelected && classes.isSelected,
              )}
            />
          );
        },
        Placeholder: props => (
          <components.Placeholder {...props} className={classes.placeholder} />
        ),
        SingleValue: props => {
          const { children } = props;
          return (
            <components.SingleValue {...props} className={classes.singleValue}>
              {prefix ? (
                <>
                  <span className={classes.prefix}>{prefix}</span>
                  {children}
                </>
              ) : (
                children
              )}
            </components.SingleValue>
          );
        },
        ClearIndicator: props => (
          <components.ClearIndicator {...props}>
            <FontAwesomeIcon
              icon="times-circle"
              className={classes.clearIcon}
            />
          </components.ClearIndicator>
        ),
        DropdownIndicator: props => {
          const {
            selectProps: { menuIsOpen },
          } = props;
          return (
            <components.DropdownIndicator {...props}>
              <FontAwesomeIcon
                icon={menuIsOpen ? 'chevron-up' : 'chevron-down'}
                className={classes.toggleMenuIcon}
              />
            </components.DropdownIndicator>
          );
        },
        Input,
      }}
      className={classnames(
        classes.dropdown,
        isHigh && classes.isHigh,
        noShadow && classes.noShadow,
      )}
    />
  );
};

export default ChainCodeCustomDropdown;
