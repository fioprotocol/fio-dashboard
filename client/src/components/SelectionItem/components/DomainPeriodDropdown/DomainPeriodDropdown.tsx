import React from 'react';

import CustomDropdown from '../../../CustomDropdown';

import { CART_ITEM_PERIOD_OPTIONS } from '../../../../constants/common';

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
        onChange={onChange}
        isDark
        withoutMarginBottom
        fitContentWidth
        hasAutoWidth
      />
    </div>
  );
};
