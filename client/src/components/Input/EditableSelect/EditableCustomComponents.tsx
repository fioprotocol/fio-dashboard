import { components } from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import classes from '../styles/EditableSelect.module.scss';

export const Input = (
  props: {
    hasValue: boolean;
    selectProps: { prefix?: string; inputValue: string; isDisabled: boolean };
  } & any,
) => {
  const {
    hasValue,
    selectProps: { prefix, inputValue, isDisabled },
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

export const Menu = (menuProps: any) => (
  <components.Menu {...menuProps} className={classes.menu} />
);

export const MenuList = (menuListprops: any) => (
  <components.MenuList {...menuListprops} className={classes.menuList} />
);

export const Placeholder = (placeholderProps: any) => (
  <components.Placeholder
    {...placeholderProps}
    className={classes.placeholder}
  />
);

export const ClearIndicator = (clearIndicatorProps: any) => (
  <components.ClearIndicator {...clearIndicatorProps}>
    <FontAwesomeIcon icon="times-circle" className={classes.clearIcon} />
  </components.ClearIndicator>
);

export const Option = (optionProps: any) => {
  const { isSelected } = optionProps;

  return (
    <components.Option
      {...optionProps}
      className={classnames(classes.option, isSelected && classes.isSelected)}
    />
  );
};

export const DropdownIndicator = (
  dropdownProps: { selectProps: { menuIsOpen: boolean } } & any,
) => {
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

export const SingleValue = (
  singleValueProps: {
    children: string;
    selectProps: { prefix?: string };
  } & any,
) => {
  const {
    children,
    selectProps: { prefix },
  } = singleValueProps;
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

export const IndicatorSeparator = () => <></>;
