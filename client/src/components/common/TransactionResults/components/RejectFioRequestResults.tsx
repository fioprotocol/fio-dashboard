import React from 'react';

import Results from '../';
import { TransactionDetails } from '../../../TransactionDetails/TransactionDetails';
import FioRecordFieldsList from '../../../../pages/WalletPage/components/FioRecordFieldsList';

import {
  FIO_REQUEST_FIELDS_LIST,
  FIO_RECORD_DETAILED_TYPE,
} from '../../../../pages/WalletPage/constants';
import { BUNDLES_TX_COUNT } from '../../../../constants/fio';

import { FioRecordViewDecrypted } from '../../../../pages/WalletPage/types';

import classes from '../styles/RejectFioRequestResults.module.scss';

type Props = {
  title: string;
  onClose: () => void;
  results: { error?: string; remaining: number } & FioRecordViewDecrypted;
  errorType?: string;
  onRetry: () => void;
  middleWidth: boolean;
  fioRecordType: string;
};

const RejectFioRequestResults: React.FC<Props> = props => {
  const { results, fioRecordType } = props;
  return (
    <Results {...props}>
      <h5 className={classes.subtitle}>Original Request Information</h5>
      <FioRecordFieldsList
        fieldsList={FIO_REQUEST_FIELDS_LIST.REJECT_REQUEST_RESULTS_LIST}
        fioRecordDecrypted={results}
        fioRecordDetailedType={FIO_RECORD_DETAILED_TYPE.RESULT}
        fioRecordType={fioRecordType}
      />
      <TransactionDetails
        className={classes.bundleContainer}
        bundles={{
          fee: BUNDLES_TX_COUNT.REJECT_FIO_REQUEST,
          remaining:
            results.error != null
              ? results.remaining
              : results.remaining - BUNDLES_TX_COUNT.REJECT_FIO_REQUEST,
        }}
      />
    </Results>
  );
};

export default RejectFioRequestResults;
