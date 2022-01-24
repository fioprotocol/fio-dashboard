import React from 'react';
import Dropdown from 'react-dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import classes from './CustomDropdown.module.scss';

type Props = {
  options: { id: string; name: string }[];
  value?: string;
  placeholder?: string;
  onChange: (id: string) => void;
  customValue?: { id: string; name: string };
  toggleToCustom?: (isCustom: boolean) => void;
  isShort?: boolean;
  isWidthResponsive?: boolean;
  isWhite?: boolean;
  hasAutoWidth?: boolean;
  isSimple?: boolean;
  isHigh?: boolean;
  isFormField?: boolean;
};

const CustomDropdown: React.FC<Props> = props => {
  const {
    options,
    onChange,
    placeholder,
    value,
    customValue,
    toggleToCustom,
    isShort,
    isWidthResponsive,
    isWhite,
    hasAutoWidth,
    isSimple,
    isHigh,
    isFormField,
  } = props;

  const styledOptions = options.map(option => ({
    value: option.id,
    label: option.name,
    className: classes.optionItem,
  }));

  if (customValue) {
    styledOptions.push({
      value: customValue.id,
      label: customValue.name,
      className: classes.optionButton,
    });
  }

  const onDropdownChange = (option: { value: string }) => {
    const { value: itemValue } = option || {};
    if (customValue && itemValue === customValue.id) {
      onChange('');
      return toggleToCustom(true);
    }
    onChange(itemValue);
  };

  return (
    <Dropdown
      options={styledOptions}
      value={value}
      onChange={onDropdownChange}
      placeholder={placeholder}
      className={classnames(
        classes.dropdown,
        isShort && classes.isShort,
        isWidthResponsive && classes.isWidthResponsive,
        hasAutoWidth && classes.hasAutoWidth,
        isFormField && classes.formField,
      )}
      controlClassName={classnames(
        classes.control,
        isWhite && classes.isWhite,
        isSimple && classes.isSimple,
        isHigh && classes.isHigh,
      )}
      placeholderClassName={classes.placeholder}
      menuClassName={classes.menu}
      arrowClosed={
        <FontAwesomeIcon icon="chevron-down" className={classes.icon} />
      }
      arrowOpen={<FontAwesomeIcon icon="chevron-up" className={classes.icon} />}
    />
  );
};

export default CustomDropdown;
