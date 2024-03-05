import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import SubmitButton from '../../components/common/SubmitButton/SubmitButton';
import CancelFioRequestResults from '../../components/common/TransactionResults/components/CancelFioRequestResults';
import PseudoModalContainer from '../../components/PseudoModalContainer';
import FioRecordFieldsList from '../WalletPage/components/FioRecordFieldsList';
import BundledTransactionBadge from '../../components/Badges/BundledTransactionBadge/BundledTransactionBadge';
import LowBalanceBadge from '../../components/Badges/LowBalanceBadge/LowBalanceBadge';
import CancelRequestEdge from './components/CancelRequestEdge';
import LedgerWalletActionNotSupported from '../../components/LedgerWalletActionNotSupported';
import PageTitle from '../../components/PageTitle/PageTitle';
import { CancelRequestMetamaskWallet } from './components/CancelRequestMetamaskWallet';

import { ERROR_TYPES } from '../../components/common/TransactionResults/constants';
import { WALLET_CREATED_FROM } from '../../constants/common';
import { BUNDLES_TX_COUNT } from '../../constants/fio';
import {
  FIO_REQUEST_FIELDS_LIST,
  FIO_RECORD_DETAILED_TYPE,
  FIO_RECORD_TYPES,
} from '../WalletPage/constants';
import { ROUTES } from '../../constants/routes';
import { LINKS } from '../../constants/labels';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';

import { useFioAddresses } from '../../util/hooks';

import { FioRecordViewDecrypted } from '../WalletPage/types';
import { FioWalletDoublet } from '../../types';

import classes from './CancelFioRequestPage.module.scss';

type Location = {
  location: {
    state: {
      fioRecordDecrypted: FioRecordViewDecrypted;
      fioWallet: FioWalletDoublet;
      fioRecordType: string;
    };
  };
};

type Props = {
  refreshWalletDataPublicKey: (publicKey: string) => void;
};

const CancelFioRequestPage: React.FC<Props &
  RouteComponentProps &
  Location> = props => {
  const {
    location: {
      state: { fioRecordDecrypted, fioWallet, fioRecordType },
    },
    history,
    refreshWalletDataPublicKey,
  } = props;

  const [walletFioCryptoHandles] = useFioAddresses(fioWallet.publicKey);

  const fioCryptoHandle =
    walletFioCryptoHandles &&
    walletFioCryptoHandles.find(
      walletFioCryptoHandle =>
        walletFioCryptoHandle.name === fioRecordDecrypted.fioRecord.from,
    );

  const { remaining = 0 } = fioCryptoHandle || {};

  const [resultsData, setResultsData] = useState<
    | ({
        error?: string;
        remaining: number;
      } & FioRecordViewDecrypted)
    | null
  >(null);
  const [processing, setProcessing] = useState(false);
  const [submitData, setSubmitData] = useState<FioRecordViewDecrypted | null>(
    null,
  );

  const hasLowBalance = remaining - BUNDLES_TX_COUNT.CANCEL_FIO_REQUEST < 0;

  const onBack = () => {
    history.push({
      pathname: ROUTES.FIO_WALLET,
      search: `${QUERY_PARAMS_NAMES.PUBLIC_KEY}=${fioWallet.publicKey}`,
      state: {
        fioRecordDecrypted,
        fioRequestTab: FIO_RECORD_TYPES.RECEIVED,
      },
    });
  };

  const onClick = () => {
    setSubmitData(fioRecordDecrypted);
  };

  const onSuccess = (
    cancelResult: FioRecordViewDecrypted & { error?: string },
  ) => {
    setResultsData({ ...cancelResult, remaining });
    !cancelResult.error && refreshWalletDataPublicKey(fioWallet.publicKey);
    setSubmitData(null);
    setProcessing(false);
  };

  const onCancel = () => {
    setSubmitData(null);
    setProcessing(false);
  };

  const onCloseResults = () => {
    history.push({
      pathname: ROUTES.FIO_WALLET,
      search: `${QUERY_PARAMS_NAMES.PUBLIC_KEY}=${fioWallet.publicKey}`,
      state: {
        fioRequestTab: FIO_RECORD_TYPES.SENT,
      },
    });
  };

  const onResultsRetry = () => {
    setResultsData(null);
  };

  if (resultsData)
    return (
      <>
        <PageTitle link={LINKS.CANCEL_FIO_REQUEST_CONFIRMATION} isVirtualPage />
        <CancelFioRequestResults
          title={resultsData.error != null ? 'Cancel Failed!' : 'Canceled!'}
          onClose={onCloseResults}
          results={resultsData}
          onRetry={onResultsRetry}
          middleWidth={true}
          fioRecordType={fioRecordType}
          errorType={ERROR_TYPES.CANCEL_ERROR}
        />
      </>
    );

  return (
    <>
      <PseudoModalContainer
        title="Cancel Request"
        onBack={onBack}
        middleWidth={true}
      >
        <div className={classes.container}>
          <h5 className={classes.subtitle}>
            You are canceling the following request
          </h5>
          <div className={classes.fieldsList}>
            <FioRecordFieldsList
              fieldsList={FIO_REQUEST_FIELDS_LIST.CANCEL_REQUEST_LIST}
              fioRecordDecrypted={fioRecordDecrypted}
              fioRecordDetailedType={FIO_RECORD_DETAILED_TYPE.REQUEST}
              fioRecordType={fioRecordType}
            />
          </div>
          <h5 className={classes.bundleSubtitle}>Transaction Cost</h5>
          <BundledTransactionBadge
            bundles={BUNDLES_TX_COUNT.CANCEL_FIO_REQUEST}
            remaining={remaining}
          />
          <LowBalanceBadge
            hasLowBalance={hasLowBalance}
            buttonText="Add more bundled transactions"
            messageText="Not enough bundles"
          />
          <SubmitButton
            text="Cancel"
            withTopMargin={true}
            onClick={onClick}
            disabled={hasLowBalance}
          />
        </div>
      </PseudoModalContainer>
      {fioWallet.from === WALLET_CREATED_FROM.EDGE ? (
        <CancelRequestEdge
          processing={processing}
          setProcessing={setProcessing}
          onSuccess={onSuccess}
          onCancel={onCancel}
          submitData={submitData}
          fioWallet={fioWallet}
        />
      ) : null}

      {fioWallet.from === WALLET_CREATED_FROM.LEDGER ? (
        <LedgerWalletActionNotSupported
          submitData={submitData}
          onCancel={onCancel}
        />
      ) : null}

      {fioWallet.from === WALLET_CREATED_FROM.METAMASK ? (
        <CancelRequestMetamaskWallet
          derivationIndex={fioWallet?.data?.derivationIndex}
          processing={processing}
          submitData={submitData}
          startProcessing={!!submitData}
          onSuccess={onSuccess}
          onCancel={onCancel}
          setProcessing={setProcessing}
        />
      ) : null}
    </>
  );
};

export default withRouter(CancelFioRequestPage);
