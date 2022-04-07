import React from 'react';
import Dropdown from 'react-dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import 'react-dropdown/style.css';
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
  isVoilet?: boolean;
  isWhitePlaceholder?: boolean;
  isWhiteIcon?: boolean;
  hasAutoWidth?: boolean;
  isSimple?: boolean;
  isHigh?: boolean;
  isFormField?: boolean;
  hasError?: boolean;
  noMinWidth?: boolean;
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
    isVoilet,
    isWhitePlaceholder,
    isWhiteIcon,
    hasAutoWidth,
    isSimple,
    isHigh,
    isFormField,
    hasError,
    noMinWidth,
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
      return toggleToCustom && toggleToCustom(true);
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
        noMinWidth && classes.noMinWidth,
      )}
      controlClassName={classnames(
        classes.control,
        isWhite && classes.isWhite,
        isVoilet && classes.isVoilet,
        isSimple && classes.isSimple,
        isHigh && classes.isHigh,
        hasError && classes.hasError,
      )}
      placeholderClassName={classnames(
        classes.placeholder,
        isWhitePlaceholder && classes.isWhitePlaceholder,
      )}
      menuClassName={classes.menu}
      arrowClosed={
        <FontAwesomeIcon
          icon="chevron-down"
          className={classnames(
            classes.icon,
            isWhiteIcon && classes.isWhiteIcon,
          )}
        />
      }
      arrowOpen={
        <FontAwesomeIcon
          icon="chevron-up"
          className={classnames(
            classes.icon,
            isWhiteIcon && classes.isWhiteIcon,
          )}
        />
      }
    />
  );
};

export default CustomDropdown;
