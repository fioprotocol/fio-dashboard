import { FC } from 'react';

import { commonFormatTime } from '../../../util/general';
import { isFioChain } from '../../../util/fio';

import { FIO_RECORD_DETAILED_FIELDS } from '../constants';
import { FIO_DATA_TRANSACTION_LINK } from '../../../constants/common';

import { FioRecordViewKeysProps } from '../types';
import { PriceComponent } from '../../../components/PriceComponent';
import { useConvertFioToUsdc } from '../../../util/hooks';

import classes from '../styles/FioRecordFieldContent.module.scss';

type Props = {
  value: string | null;
  field: FioRecordViewKeysProps;
  chain: string;
  token: string;
};

const FioRecordFieldContent: FC<Props> = props => {
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
    return <RenderFIOPriceComponent value={value} />;
  }

  if (field === FIO_RECORD_DETAILED_FIELDS.amount && !isFioChain(chain)) {
    return (
      <PriceComponent
        className={classes.priceValue}
        costFio={value}
        tokenCode={token || chain}
      />
    );
  }
  return <>{value}</>;
};

type RenderFIOPriceComponentProps = {
  value: string;
};

const RenderFIOPriceComponent: FC<RenderFIOPriceComponentProps> = ({
  value,
}) => {
  const usdcPrice = useConvertFioToUsdc({ fioAmount: value });

  return (
    <PriceComponent
      className={classes.priceValue}
      costFio={value}
      costUsdc={usdcPrice}
    />
  );
};

export default FioRecordFieldContent;
