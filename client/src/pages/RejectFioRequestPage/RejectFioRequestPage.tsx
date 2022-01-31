import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import SubmitButton from '../../components/common/SubmitButton/SubmitButton';
import RejectFioRequestResults from '../../components/common/TransactionResults/components/RejectFioRequestResults';
import PseudoModalContainer from '../../components/PseudoModalContainer';
import TransactionFieldsList from '../WalletPage/components/TransactionFieldsList';
import BundledTransactionBadge from '../../components/Badges/BundledTransactionBadge/BundledTransactionBadge';
import LowBalanceBadge from '../../components/Badges/LowBalanceBadge/LowBalanceBadge';
import RejectRequestEdge from './components/RejectRequestEdge';

import { putParamsToUrl } from '../../utils';
import { useFioAddresses } from '../../util/hooks';

import { WALLET_CREATED_FROM } from '../../constants/common';
import { BUNDLES_TX_COUNT } from '../../constants/fio';
import { FIO_REQUEST_FIELDS_LIST } from '../WalletPage/constants';
import { ROUTES } from '../../constants/routes';

import { TransactionItemProps } from '../WalletPage/types';
import { FioNameItemProps, FioWalletDoublet } from '../../types';

import classes from './RejectFioRequestPage.module.scss';

type Location = {
  location: {
    state: {
      fioRequest: TransactionItemProps;
      fioWallet: FioWalletDoublet;
    };
  };
};

type Props = {
  getFioAddresses: (publicKey: string) => void;
  fioAddresses: FioNameItemProps[];
};

const RejectFioRequestPage: React.FC<Props &
  RouteComponentProps &
  Location> = props => {
  const {
    location: {
      state: { fioRequest, fioWallet },
    },
    fioAddresses,
    history,
  } = props;

  useFioAddresses();

  const fioCryptoHandle =
    fioAddresses &&
    fioAddresses.find(fioAddress => fioAddress.name === fioRequest.to);

  const { remaining = 0 } = fioCryptoHandle || {};

  const [resultsData, setResultsData] = useState<
    | ({
        error?: string;
        remaining: number;
      } & TransactionItemProps)
    | null
  >(null);
  const [processing, setProcessing] = useState(false);
  const [submitData, setSubmitData] = useState<TransactionItemProps | null>(
    null,
  );

  const hasLowBalance = remaining - BUNDLES_TX_COUNT.REJECT_FIO_REQUEST < 0;

  const onBack = () => {
    history.push(
      putParamsToUrl(ROUTES.FIO_WALLET, { publicKey: fioWallet.publicKey }),
      {
        transactionItem: fioRequest,
        fioRequestTab: fioRequest.transactionType,
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
      { fioRequestTab: fioRequest.transactionType },
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
            <TransactionFieldsList
              fieldsList={FIO_REQUEST_FIELDS_LIST.REJECT_REQUEST_LIST}
              transactionItem={fioRequest}
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
