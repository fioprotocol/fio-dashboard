import React from 'react';

import Results from '../Results';
import BundledTransactionBadge from '../../../Badges/BundledTransactionBadge/BundledTransactionBadge';
import TransactionFieldsList from '../../../../pages/WalletPage/components/TransactionFieldsList';

import { FIO_REQUEST_FIELDS_LIST } from '../../../../pages/WalletPage/constants';
import { BUNDLES_TX_COUNT } from '../../../../constants/fio';

import { TransactionItemProps } from '../../../../pages/WalletPage/types';

import classes from '../styles/RejectFioRequestResults.module.scss';

type Props = {
  title: string;
  onClose: () => void;
  results: { error?: string; remaining: number } & TransactionItemProps;
};

const RejectFioRequestResults: React.FC<Props> = props => {
  const { results } = props;
  return (
    <Results {...props}>
      <h5 className={classes.subtitle}>Original Request Information</h5>
      <TransactionFieldsList
        fieldsList={FIO_REQUEST_FIELDS_LIST.REJECT_REQUEST_RESULTS_LIST}
        transactionItem={results}
      />
      <div className={classes.bundleContainer}>
        <BundledTransactionBadge
          bundles={BUNDLES_TX_COUNT.REJECT_FIO_REQUEST}
          remaining={results.remaining - BUNDLES_TX_COUNT.REJECT_FIO_REQUEST}
        />
      </div>
    </Results>
  );
};

export default RejectFioRequestResults;
