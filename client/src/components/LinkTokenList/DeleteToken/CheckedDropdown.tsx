import React from 'react';
import Dropdown from 'react-dropdown';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import classes from './DeleteToken.module.scss';

export const DROPDOWN_OPTIONS = {
  ALL: 'All',
  NONE: 'None',
};

type Props = {
  allCheckedChange: (flag: boolean) => void;
  allChecked: boolean;
  hasLowBalance: boolean;
};

const CheckedDropdown: React.FC<Props> = props => {
  const { allCheckedChange, allChecked, hasLowBalance } = props;

  const isDisabledCheckbox = !allChecked && hasLowBalance;

  const onCheckboxClick = () => {
    if (!isDisabledCheckbox) return allCheckedChange(!allChecked);
  };

  const isDisabledOption = (option: string) => {
    const isAllCheckedOption = option === DROPDOWN_OPTIONS.ALL;
    return hasLowBalance && isAllCheckedOption;
  };

  const onDropdownChange = (option: {
    value: string;
    label: React.ReactNode;
  }) => {
    const { value } = option;
    const isAllCheckedOption = value === DROPDOWN_OPTIONS.ALL;

    if (isDisabledOption(value)) return;
    allCheckedChange(isAllCheckedOption);
  };

  const styledOptions = Object.values(DROPDOWN_OPTIONS).map(option => ({
    value: option,
    label: option,
    className: classnames(
      classes.optionItem,
      isDisabledOption(option) && classes.isDisabled,
    ),
  }));

  return (
    <div className={classes.dropdownContainer}>
      <FontAwesomeIcon
        icon={
          allChecked ? 'check-square' : { prefix: 'far', iconName: 'square' }
        }
        onClick={onCheckboxClick}
        className={classnames(
          classes.allChecked,
          isDisabledCheckbox && classes.isDisabled,
        )}
      />
      <Dropdown
        options={styledOptions}
        onChange={onDropdownChange}
        className={classes.dropdown}
        controlClassName={classes.control}
        placeholderClassName={classes.placeholder}
        menuClassName={classes.menu}
        arrowClosed={
          <FontAwesomeIcon icon="chevron-down" className={classes.icon} />
        }
        arrowOpen={
          <FontAwesomeIcon icon="chevron-up" className={classes.icon} />
        }
      />
    </div>
  );
};

export default CheckedDropdown;
