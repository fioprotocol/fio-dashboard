import React from 'react';
import Dropdown from 'react-dropdown';
import classnames from 'classnames';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import 'react-dropdown/style.css';
import classes from './CustomDropdown.module.scss';

type Props = {
  options: { id: string; name: string | React.ReactNode }[];
  value?: string;
  placeholder?: string;
  onChange: (id: string) => void;
  customValue?: { id: string; name: string | React.ReactNode };
  toggleToCustom?: (isCustom: boolean) => void;
  isShort?: boolean;
  isSmall?: boolean;
  isWidthResponsive?: boolean;
  isWhite?: boolean;
  isVoilet?: boolean;
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
    isVoilet,
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
      )}
      controlClassName={classnames(
        classes.control,
        isWhite && classes.isWhite,
        isVoilet && classes.isVoilet,
        isDark && classes.isDark,
        isSimple && classes.isSimple,
        isHigh && classes.isHigh,
        hasAutoHeight && classes.hasAutoHeight,
        hasError && classes.hasError,
        hasLightBorder && classes.hasLightBorder,
        hasBigBorderRadius && classes.hasBigBorderRadius,
      )}
      placeholderClassName={classnames(
        classes.placeholder,
        isWhitePlaceholder && classes.isWhitePlaceholder,
        isBlackPlaceholder && classes.isBlackPlaceholder,
      )}
      menuClassName={classnames(
        classes.menu,
        hasRelativePosition && classes.hasRelativePosition,
      )}
      arrowClosed={
        <ExpandMoreIcon
          className={classnames(
            classes.icon,
            isWhiteIcon && classes.isWhiteIcon,
          )}
        />
      }
      arrowOpen={
        <ExpandLessIcon
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
