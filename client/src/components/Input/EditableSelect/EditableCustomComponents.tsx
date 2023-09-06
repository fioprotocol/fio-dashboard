import React from 'react';
import { components } from 'react-select';
import classnames from 'classnames';
import { Button } from 'react-bootstrap';
import CancelIcon from '@mui/icons-material/Cancel';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import classes from '../styles/EditableSelect.module.scss';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EditableCustomComponentsTypes = any; // todo: set proper types

type InputProps = {
  hasValue: boolean;
  selectProps: { inputValue: string; isDisabled: boolean };
} & EditableCustomComponentsTypes;

export const Input: React.FC<InputProps> = (props: InputProps) => {
  const {
    hasValue,
    selectProps: { prefix, inputValue, isDisabled, uiType },
  } = props;

  if (!inputValue && isDisabled) return null;

  const renderInput = () => (
    <components.Input
      {...props}
      isHidden={false}
      className={classnames(classes.input, uiType && classes[uiType])}
    />
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

export const MenuList: React.FC<EditableCustomComponentsTypes> = menuListProps => {
  const {
    selectProps: { actionButtonText, actionButtonClick, inputValue },
    setValue,
  } = menuListProps;

  const onClick = () => {
    if (actionButtonClick) {
      actionButtonClick();
    } else {
      setValue('', 'set-value');
    }
  };

  return (
    <>
      <components.MenuList {...menuListProps} className={classes.menuList} />
      {actionButtonText && !inputValue && (
        <div className="d-flex">
          <Button className={classes.actionButton} onClick={onClick}>
            {actionButtonText}
          </Button>
        </div>
      )}
    </>
  );
};
export const Placeholder: React.FC<EditableCustomComponentsTypes> = placeholderProps => {
  const {
    selectProps: { uiType },
  } = placeholderProps;

  return (
    <components.Placeholder
      {...placeholderProps}
      className={classnames(classes.placeholder, uiType && classes[uiType])}
    />
  );
};

export const ClearIndicator: React.FC<EditableCustomComponentsTypes> = clearIndicatorProps => {
  const {
    selectProps: { uiType },
  } = clearIndicatorProps;
  return (
    <components.ClearIndicator {...clearIndicatorProps}>
      <CancelIcon
        className={classnames(classes.clearIcon, uiType && classes[uiType])}
      />
    </components.ClearIndicator>
  );
};

export const Option: React.FC<EditableCustomComponentsTypes> = optionProps => {
  const {
    isSelected,
    selectProps: { inputPrefix },
  } = optionProps;

  return (
    <components.Option
      {...optionProps}
      className={classnames(
        classes.option,
        isSelected && classes.isSelected,
        inputPrefix && classes.inputPrefix,
      )}
    />
  );
};

export const Control: React.FC<EditableCustomComponentsTypes> = controlProps => {
  const {
    selectProps: { menuIsOpen },
  } = controlProps;
  return (
    <components.Control
      {...controlProps}
      className={menuIsOpen && classes.menuIsOpen}
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
      {menuIsOpen ? (
        <ExpandLessIcon className={classes.toggleMenuIcon} />
      ) : (
        <ExpandMoreIcon className={classes.toggleMenuIcon} />
      )}
    </components.DropdownIndicator>
  );
};

export const IndicatorSeparator: React.FC = () => <></>;
