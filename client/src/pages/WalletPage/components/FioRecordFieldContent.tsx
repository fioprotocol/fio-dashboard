import React from 'react';

import ConvertedAmount from '../../../components/ConvertedAmount/ConvertedAmount';
import Amount from '../../../components/common/Amount';

import { commonFormatTime } from '../../../util/general';
import { priceToNumber } from '../../../utils';
import { isFioChain } from '../../../util/fio';

import { FIO_RECORD_DETAILED_FIELDS } from '../constants';
import { FIO_DATA_TRANSACTION_LINK } from '../../../constants/common';

import { FioRecordViewKeysProps } from '../types';

type Props = {
  value: string | null;
  field: FioRecordViewKeysProps;
  chain: string;
  token: string;
};

const FioRecordFieldContent: React.FC<Props> = props => {
  const { field, value, chain, token } = props;

  if (value == null) return;

  if (
    field === FIO_RECORD_DETAILED_FIELDS.obtId &&
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

  if (field === FIO_RECORD_DETAILED_FIELDS.date)
    return <>{commonFormatTime(value)}</>;

  if (field === FIO_RECORD_DETAILED_FIELDS.amount && isFioChain(chain)) {
    const price = priceToNumber(value);

    return (
      <span>
        <ConvertedAmount fioAmount={price} /> (<Amount value={price} /> FIO)
      </span>
    );
  }

  if (field === FIO_RECORD_DETAILED_FIELDS.amount && !isFioChain(chain)) {
    return (
      <span>
        {value} {token || chain}
      </span>
    );
  }
  return <>{value}</>;
};

export default FioRecordFieldContent;
