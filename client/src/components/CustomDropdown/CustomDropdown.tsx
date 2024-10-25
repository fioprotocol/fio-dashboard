import React from 'react';
import Dropdown from 'react-dropdown';
import classnames from 'classnames';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import 'react-dropdown/style.css';
import classes from './CustomDropdown.module.scss';
import Loader from '../Loader/Loader';

type Option = {
  id: string;
  name: string | React.ReactNode;
};

type Props = {
  options: Option[];
  value?: string;
  placeholder?: string;
  onChange: (id: string) => void;
  customValue?: Option;
  toggleToCustom?: (isCustom: boolean) => void;
  isShort?: boolean;
  isSmall?: boolean;
  isWidthResponsive?: boolean;
  isWhite?: boolean;
  isViolet?: boolean;
  isIndigo?: boolean;
  isDark?: boolean;
  isWhitePlaceholder?: boolean;
  isBlackPlaceholder?: boolean;
  isWhiteIcon?: boolean;
  hasAutoWidth?: boolean;
  hasRelativePosition?: boolean;
  fitContentWidth?: boolean;
  isSimple?: boolean;
  isHigh?: boolean;
  hasAutoHeight?: boolean;
  withoutMarginBottom?: boolean;
  hasError?: boolean;
  noMinWidth?: boolean;
  hasLightBorder?: boolean;
  hasBigBorderRadius?: boolean;
  disabled?: boolean;
  dropdownClassNames?: string;
  controlClassNames?: string;
  placeholderClassNames?: string;
  menuClassNames?: string;
  arrowCloseClassNames?: string;
  arrowOpenClassNames?: string;
  optionItemClassNames?: string;
  optionButtonClassNames?: string;
  defaultOptionValue?: { id: string; name: string };
  loading?: boolean;
  actionOnChange?: () => void;
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
    isSmall,
    isWidthResponsive,
    isWhite,
    isViolet,
    isIndigo,
    isDark,
    isWhitePlaceholder,
    isBlackPlaceholder,
    isWhiteIcon,
    hasAutoWidth,
    fitContentWidth,
    isSimple,
    isHigh,
    hasAutoHeight,
    hasRelativePosition,
    withoutMarginBottom,
    hasError,
    noMinWidth,
    hasLightBorder,
    hasBigBorderRadius,
    disabled,
    dropdownClassNames,
    controlClassNames,
    placeholderClassNames,
    menuClassNames,
    arrowCloseClassNames,
    arrowOpenClassNames,
    optionItemClassNames,
    optionButtonClassNames,
    defaultOptionValue,
    loading,
    actionOnChange,
  } = props;

  const styledOptions = options.map(option => ({
    value: option.id,
    label: option.name,
    className: classnames(classes.optionItem, optionItemClassNames),
  }));

  if (customValue) {
    styledOptions.push({
      value: customValue.id,
      label: customValue.name,
      className: classnames(classes.optionButton, optionButtonClassNames),
    });
  }

  const onDropdownChange = (option: { value: string }) => {
    const { value: itemValue } = option || {};
    if (customValue && itemValue === customValue.id) {
      onChange('');
      return toggleToCustom && toggleToCustom(true);
    }
    onChange(itemValue);
    actionOnChange && actionOnChange();
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Dropdown
      options={styledOptions}
      value={defaultOptionValue?.name || value}
      onChange={onDropdownChange}
      placeholder={placeholder}
      disabled={disabled}
      className={classnames(
        classes.dropdown,
        isShort && classes.isShort,
        isSmall && classes.isSmall,
        isWidthResponsive && classes.isWidthResponsive,
        hasAutoWidth && classes.hasAutoWidth,
        fitContentWidth && classes.fitContentWidth,
        withoutMarginBottom && classes.withoutMarginBottom,
        noMinWidth && classes.noMinWidth,
        dropdownClassNames,
      )}
      controlClassName={classnames(
        classes.control,
        isWhite && classes.isWhite,
        isViolet && classes.isVoilet,
        isIndigo && classes.isIndigo,
        isDark && classes.isDark,
        isSimple && classes.isSimple,
        isHigh && classes.isHigh,
        hasAutoHeight && classes.hasAutoHeight,
        hasError && classes.hasError,
        hasLightBorder && classes.hasLightBorder,
        hasBigBorderRadius && classes.hasBigBorderRadius,
        controlClassNames,
      )}
      placeholderClassName={classnames(
        classes.placeholder,
        isWhitePlaceholder && classes.isWhitePlaceholder,
        isBlackPlaceholder && classes.isBlackPlaceholder,
        placeholderClassNames,
      )}
      menuClassName={classnames(
        classes.menu,
        hasRelativePosition && classes.hasRelativePosition,
        menuClassNames,
      )}
      arrowClosed={
        <ExpandMoreIcon
          className={classnames(
            classes.icon,
            isWhiteIcon && classes.isWhiteIcon,
            arrowCloseClassNames,
          )}
        />
      }
      arrowOpen={
        <ExpandLessIcon
          className={classnames(
            classes.icon,
            isWhiteIcon && classes.isWhiteIcon,
            arrowOpenClassNames,
          )}
        />
      }
    />
  );
};

export default CustomDropdown;
