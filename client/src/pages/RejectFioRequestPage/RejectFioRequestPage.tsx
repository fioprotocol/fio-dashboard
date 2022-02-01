import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import SubmitButton from '../../components/common/SubmitButton/SubmitButton';
import RejectFioRequestResults from '../../components/common/TransactionResults/components/RejectFioRequestResults';
import PseudoModalContainer from '../../components/PseudoModalContainer';
import FioDataFieldsList from '../WalletPage/components/FioDataFieldsList';
import BundledTransactionBadge from '../../components/Badges/BundledTransactionBadge/BundledTransactionBadge';
import LowBalanceBadge from '../../components/Badges/LowBalanceBadge/LowBalanceBadge';
import RejectRequestEdge from './components/RejectRequestEdge';

import { putParamsToUrl } from '../../utils';
import { useFioAddresses } from '../../util/hooks';

import { WALLET_CREATED_FROM } from '../../constants/common';
import { BUNDLES_TX_COUNT } from '../../constants/fio';
import { FIO_REQUEST_FIELDS_LIST } from '../WalletPage/constants';
import { ROUTES } from '../../constants/routes';

import { FioDataItemProps } from '../WalletPage/types';
import { FioWalletDoublet } from '../../types';

import classes from './RejectFioRequestPage.module.scss';

type Location = {
  location: {
    state: {
      fioRequest: FioDataItemProps;
      fioWallet: FioWalletDoublet;
    };
  };
};

type Props = {
  getFioAddresses: (publicKey: string) => void;
};

const RejectFioRequestPage: React.FC<Props &
  RouteComponentProps &
  Location> = props => {
  const {
    location: {
      state: { fioRequest, fioWallet },
    },
    history,
  } = props;

  const walletFioCryptoHandles = useFioAddresses(fioWallet.publicKey);

  const fioCryptoHandle =
    walletFioCryptoHandles &&
    walletFioCryptoHandles.find(
      walletFioCryptoHandle => walletFioCryptoHandle.name === fioRequest.to,
    );

  const { remaining = 0 } = fioCryptoHandle || {};

  const [resultsData, setResultsData] = useState<
    | ({
        error?: string;
        remaining: number;
      } & FioDataItemProps)
    | null
  >(null);
  const [processing, setProcessing] = useState(false);
  const [submitData, setSubmitData] = useState<FioDataItemProps | null>(null);

  const hasLowBalance = remaining - BUNDLES_TX_COUNT.REJECT_FIO_REQUEST < 0;

  const onBack = () => {
    history.push(
      putParamsToUrl(ROUTES.FIO_WALLET, { publicKey: fioWallet.publicKey }),
      {
        fioDataItem: fioRequest,
        fioRequestTab: fioRequest.fioDataTxType,
      },
    );
  };

  const onClick = () => {
    setSubmitData(fioRequest);
  };

  const onSuccess = () => {
    setResultsData({ ...fioRequest, remaining });
    setSubmitData(null);
    setProcessing(false);
  };

  const onCancel = () => {
    setSubmitData(null);
    setProcessing(false);
  };

  const onCloseResults = () => {
    history.push(
      putParamsToUrl(ROUTES.FIO_WALLET, {
        publicKey: fioWallet.publicKey,
      }),
      { fioRequestTab: fioRequest.fioDataTxType },
    );
  };

  const onResultsRetry = () => {
    setResultsData(null);
  };

  if (resultsData)
    return (
      <RejectFioRequestResults
        title={resultsData.error ? 'Rejection Failed!' : 'Rejection Details!'}
        onClose={onCloseResults}
        results={resultsData}
        onRetry={onResultsRetry}
        middleWidth={true}
      />
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
            <FioDataFieldsList
              fieldsList={FIO_REQUEST_FIELDS_LIST.REJECT_REQUEST_LIST}
              fioDataItem={fioRequest}
            />
          </div>
          <h5 className={classes.bundleSubtitle}>Transaction Cost</h5>
          <BundledTransactionBadge
            bundles={BUNDLES_TX_COUNT.REJECT_FIO_REQUEST}
            remaining={remaining}
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
      {fioWallet.from === WALLET_CREATED_FROM.EDGE ? (
        <RejectRequestEdge
          processing={processing}
          setProcessing={setProcessing}
          onSuccess={onSuccess}
          onCancel={onCancel}
          submitData={submitData}
          fioWallet={fioWallet}
        />
      ) : null}
    </>
  );
};

export default withRouter(RejectFioRequestPage);
