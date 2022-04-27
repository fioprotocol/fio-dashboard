import React from 'react';
import { components } from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import classes from '../styles/EditableSelect.module.scss';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EditableCustomComponentsTypes = any; // todo: set proper types

type InputProps = {
  hasValue: boolean;
  selectProps: { inputValue: string; isDisabled: boolean };
} & EditableCustomComponentsTypes;

export const Input: React.FC<InputProps> = (
  props: InputProps,
  prefix?: string,
) => {
  const {
    hasValue,
    selectProps: { inputValue, isDisabled },
  } = props;

  if (!inputValue && isDisabled) return null;

  const renderInput = () => (
    <components.Input {...props} isHidden={false} className={classes.input} />
  );

  return (
    <>
      {prefix && hasValue ? (
        <div className={classes.prefixContainer}>
          <span className={classes.prefix}>{prefix}</span>
          {renderInput()}
        </div>
      ) : (
        renderInput()
      )}
    </>
  );
};

export const Menu: React.FC<EditableCustomComponentsTypes> = menuProps => (
  <components.Menu {...menuProps} className={classes.menu} />
);

export const MenuList: React.FC<EditableCustomComponentsTypes> = menuListProps => (
  <components.MenuList {...menuListProps} className={classes.menuList} />
);

export const Placeholder: React.FC<EditableCustomComponentsTypes> = placeholderProps => (
  <components.Placeholder
    {...placeholderProps}
    className={classes.placeholder}
  />
);

export const ClearIndicator: React.FC<EditableCustomComponentsTypes> = clearIndicatorProps => (
  <components.ClearIndicator {...clearIndicatorProps}>
    <FontAwesomeIcon icon="times-circle" className={classes.clearIcon} />
  </components.ClearIndicator>
);

export const Option: React.FC<EditableCustomComponentsTypes> = optionProps => {
  const { isSelected } = optionProps;

  return (
    <components.Option
      {...optionProps}
      className={classnames(classes.option, isSelected && classes.isSelected)}
    />
  );
};

type DropdownIndicatorProps = {
  selectProps: { menuIsOpen: boolean };
} & EditableCustomComponentsTypes;
export const DropdownIndicator: React.FC<DropdownIndicatorProps> = dropdownProps => {
  const {
    selectProps: { menuIsOpen },
  } = dropdownProps;
  return (
    <components.DropdownIndicator {...dropdownProps}>
      <FontAwesomeIcon
        icon={menuIsOpen ? 'chevron-up' : 'chevron-down'}
        className={classes.toggleMenuIcon}
      />
    </components.DropdownIndicator>
  );
};

type SingleValueProps = {
  children: string;
} & EditableCustomComponentsTypes;

export const SingleValue: React.FC<SingleValueProps> = (
  singleValueProps: SingleValueProps,
  prefix?: string,
) => {
  const { children } = singleValueProps;
  return (
    <div className={classes.prefixContainer}>
      <components.SingleValue
        {...singleValueProps}
        className={classes.singleValue}
      >
        {prefix ? (
          <>
            <span className={classes.prefix}>{prefix}</span>
            {children}
          </>
        ) : (
          children
        )}
      </components.SingleValue>
    </div>
  );
};

export const IndicatorSeparator: React.FC = () => <></>;
