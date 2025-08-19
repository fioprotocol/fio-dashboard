import React from 'react';

import CustomDropdown from '../../../CustomDropdown';

import {
  CART_ITEM_PERIOD_OPTIONS,
  DEFAULT_CART_ITEM_PERIOD_OPTION,
} from '../../../../constants/common';

import classes from './DomainPeriodDropdown.module.scss';

type Props = {
  id: string;
  period: number;
  onPeriodChange: (period: string, id: string) => void;
};

export const DomainPeriodDropdown: React.FC<Props> = props => {
  const { id, period, onPeriodChange } = props;

  const onChange = (period: string) => {
    onPeriodChange(period, id);
  };

  return (
    <div>
      <CustomDropdown
        value={period?.toString()}
        options={CART_ITEM_PERIOD_OPTIONS}
        defaultOptionValue={DEFAULT_CART_ITEM_PERIOD_OPTION}
        onChange={onChange}
        isDark
        withoutMarginBottom
        hasAutoWidth
        placeholderClassNames={classes.placeholder}
        controlClassNames={classes.control}
      />
    </div>
  );
};
