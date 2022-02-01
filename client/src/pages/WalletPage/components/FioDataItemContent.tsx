import React from 'react';

import ConvertedAmount from '../../../components/ConvertedAmount/ConvertedAmount';

import { commonFormatTime } from '../../../util/general';
import { priceToNumber } from '../../../utils';

import { DETAILED_ITEM_FIELDS } from '../constants';
import { CHAIN_CODES } from '../../../constants/common';

import { FIO_DATA_TRANSACTION_LINK } from '../../../constants/common';

import { FioDataItemKeysProps } from '../types';

type Props = {
  value: string;
  field: FioDataItemKeysProps;
  chain: string;
};

const FioDataItemContent: React.FC<Props> = props => {
  const { field, value, chain } = props;

  if (
    field === DETAILED_ITEM_FIELDS.txId &&
    Object.keys(FIO_DATA_TRANSACTION_LINK).some(
      chainName => chainName === chain,
    )
  )
    return (
      <a
        href={`${FIO_DATA_TRANSACTION_LINK[chain]}${value}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {value}
      </a>
    );

  if (field === DETAILED_ITEM_FIELDS.date)
    return <>{commonFormatTime(value)}</>;

  if (field === DETAILED_ITEM_FIELDS.amount && chain === CHAIN_CODES.FIO) {
    const price = priceToNumber(value);

    return (
      <span>
        {price} FIO (<ConvertedAmount fioAmount={price} />)
      </span>
    );
  }

  return <>{value}</>;
};

export default FioDataItemContent;
