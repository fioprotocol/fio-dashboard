import React, { useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import SubmitButton from '../../components/common/SubmitButton/SubmitButton';
import RejectFioRequestResults from '../../components/common/TransactionResults/components/RejectFioRequestResults';
import PseudoModalContainer from '../../components/PseudoModalContainer';
import FioRecordFieldsList from '../WalletPage/components/FioRecordFieldsList';
import LowBalanceBadge from '../../components/Badges/LowBalanceBadge/LowBalanceBadge';
import RejectRequestEdge from './components/RejectRequestEdge';
import RejectRequestLedger from './components/RejectRequestLedger';
import WalletAction from '../../components/WalletAction/WalletAction';
import PageTitle from '../../components/PageTitle/PageTitle';
import { TransactionDetails } from '../../components/TransactionDetails/TransactionDetails';
import { RejectRequestMetamaskWallet } from './components/RejectRequestMetamaskWallet';

import { ERROR_TYPES } from '../../components/common/TransactionResults/constants';
import { CONFIRM_PIN_ACTIONS } from '../../constants/common';
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
import { FeePrice, FioWalletDoublet } from '../../types';

import classes from './RejectFioRequestPage.module.scss';

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
  feePrice: FeePrice;
  getFee: (fioAddress: string) => void;
  refreshWalletDataPublicKey: (publicKey: string) => void;
};

const RejectFioRequestPage: React.FC<Props &
  RouteComponentProps &
  Location> = props => {
  const {
    location,
    history,
    refreshWalletDataPublicKey,
    feePrice,
    getFee,
  } = props;

  const { fioRecordDecrypted, fioWallet, fioRecordType } = location.state || {};

  const [walletFioCryptoHandles] = useFioAddresses(fioWallet?.publicKey);

  const fioCryptoHandle =
    walletFioCryptoHandles &&
    walletFioCryptoHandles.find(
      walletFioCryptoHandle =>
        walletFioCryptoHandle.name === fioRecordDecrypted?.fioRecord.to,
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

  useEffect(() => {
    if (fioRecordDecrypted?.fioRecord?.to) {
      getFee(fioRecordDecrypted.fioRecord.to);
    }
  }, [fioRecordDecrypted, getFee]);

  const hasLowBalance = remaining - BUNDLES_TX_COUNT.REJECT_FIO_REQUEST < 0;

  const onBack = () => {
    const goToFioWalletRouteParams = {
      pathname: ROUTES.FIO_WALLET,
      search: `${QUERY_PARAMS_NAMES.PUBLIC_KEY}=${fioWallet?.publicKey}`,
      state: {
        fioRecordDecrypted,
        fioRequestTab: FIO_RECORD_TYPES.RECEIVED,
      },
    };

    const gotToFioWalletsListRputeParams = {
      pathname: ROUTES.TOKENS,
      state: {},
    };

    history.push(
      fioWallet?.publicKey
        ? goToFioWalletRouteParams
        : gotToFioWalletsListRputeParams,
    );
  };

  const onClick = () => {
    setSubmitData(fioRecordDecrypted);
  };

  const onSuccess = (
    rejectResult: FioRecordViewDecrypted & { error?: string },
  ) => {
    setResultsData({ ...rejectResult, remaining });
    !rejectResult.error && refreshWalletDataPublicKey(fioWallet?.publicKey);
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
      search: `${QUERY_PARAMS_NAMES.PUBLIC_KEY}=${fioWallet?.publicKey}`,
      state: {
        fioRequestTab: FIO_RECORD_TYPES.RECEIVED,
      },
    });
  };

  const onResultsRetry = () => {
    setResultsData(null);
  };

  if (!fioRecordType && !fioRecordDecrypted) {
    history.push(ROUTES.TOKENS);
    return null;
  }

  if (resultsData)
    return (
      <>
        <PageTitle link={LINKS.REJECT_FIO_REQUEST_CONFIRMATION} isVirtualPage />
        <RejectFioRequestResults
          title={resultsData.error != null ? 'Rejection Failed!' : 'Rejected!'}
          onClose={onCloseResults}
          results={resultsData}
          onRetry={onResultsRetry}
          middleWidth={true}
          fioRecordType={fioRecordType}
          errorType={ERROR_TYPES.REJECT_ERROR}
        />
      </>
    );

  return (
    <>
      <PseudoModalContainer
        title="Reject Request"
        onBack={onBack}
        middleWidth={true}
      >
        <div className={classes.container}>
          <h5 className={classes.subtitle}>
            You are rejecting the following request
          </h5>
          <div className={classes.fieldsList}>
            <FioRecordFieldsList
              fieldsList={FIO_REQUEST_FIELDS_LIST.REJECT_REQUEST_LIST}
              fioRecordDecrypted={fioRecordDecrypted}
              fioRecordDetailedType={FIO_RECORD_DETAILED_TYPE.REQUEST}
              fioRecordType={fioRecordType}
            />
          </div>
          <h5 className={classes.bundleSubtitle}>Transaction Details</h5>
          <TransactionDetails
            bundles={{
              fee: BUNDLES_TX_COUNT.REJECT_FIO_REQUEST,
              remaining: remaining,
            }}
          />
          <LowBalanceBadge
            hasLowBalance={hasLowBalance}
            buttonText="Add more bundled transactions"
            messageText="Not enough bundles"
          />
          <SubmitButton
            text="Reject"
            withTopMargin={true}
            onClick={onClick}
            disabled={hasLowBalance}
          />
        </div>
      </PseudoModalContainer>

      <WalletAction
        fee={feePrice.nativeFio}
        fioWallet={fioWallet}
        onCancel={onCancel}
        onSuccess={onSuccess}
        submitData={submitData}
        processing={processing}
        setProcessing={setProcessing}
        action={CONFIRM_PIN_ACTIONS.REJECT_FIO_REQUEST}
        FioActionWallet={RejectRequestEdge}
        LedgerActionWallet={RejectRequestLedger}
        MetamaskActionWallet={RejectRequestMetamaskWallet}
      />
    </>
  );
};

export default withRouter(RejectFioRequestPage);
