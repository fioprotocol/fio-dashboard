import React, { useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import SubmitButton from '../../components/common/SubmitButton/SubmitButton';
import RejectFioRequestResults from '../../components/common/TransactionResults/components/RejectFioRequestResults';
import PseudoModalContainer from '../../components/PseudoModalContainer';
import EdgeConfirmAction from '../../components/EdgeConfirmAction';
import TransactionFieldsList from '../WalletPage/components/TransactionFieldsList';
import BundledTransactionBadge from '../../components/Badges/BundledTransactionBadge/BundledTransactionBadge';
import LowBalanceBadge from '../../components/Badges/LowBalanceBadge/LowBalanceBadge';

import { putParamsToUrl } from '../../utils';

import { CONFIRM_PIN_ACTIONS } from '../../constants/common';
import { BUNDLES_TX_COUNT } from '../../constants/fio';
import { FIO_REQUEST_FIELDS_LIST } from '../WalletPage/constants';
import { ROUTES } from '../../constants/routes';

import { TransactionItemProps } from '../WalletPage/types';
import { FioNameItemProps, FioWalletDoublet } from '../../types';

import classes from './RejectFioRequestPage.module.scss';

const PROCESSING_PROPS = {
  title: 'Rejecting FIO Request',
  message: 'Hang tight while we are rejecting FIO request',
};

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
    getFioAddresses,
    history,
  } = props;

  const fioCryptoHandle =
    fioAddresses &&
    fioAddresses.find(
      fioAddress => fioAddress.walletPublicKey === fioWallet.publicKey,
    );

  const { remaining } = fioCryptoHandle || {};

  const [resultsData, setResultsData] = useState<
    | ({
        error?: string;
        remaining: number;
      } & TransactionItemProps)
    | null
  >(null);
  const [processing, setProcessing] = useState(false);
  const [submitData, setSubmitData] = useState(null);

  const hasLowBalance = remaining - BUNDLES_TX_COUNT.REJECT_FIO_REQUEST < 0;

  useEffect(() => {
    if (fioWallet && fioWallet.publicKey) {
      getFioAddresses(fioWallet.publicKey);
    }
  }, []);

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
    setSubmitData(true);
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

  const rejectRequest = () => {
    // todo: set reject action
  };

  const onCloseResults = () => {
    history.push(
      putParamsToUrl(ROUTES.FIO_WALLET, {
        publicKey: fioWallet.publicKey,
        fioRequestTab: fioRequest.transactionType,
      }),
    );
  };

  if (resultsData)
    return (
      <RejectFioRequestResults
        title={resultsData.error ? 'Rejection Failed!' : 'Rejection Details!'}
        onClose={onCloseResults}
        results={resultsData}
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
      <EdgeConfirmAction
        onSuccess={onSuccess}
        onCancel={onCancel}
        submitAction={rejectRequest}
        data={submitData}
        action={CONFIRM_PIN_ACTIONS.REJECT_FIO_REQUEST}
        processing={processing}
        setProcessing={setProcessing}
        fioWalletEdgeId={(fioWallet && fioWallet.edgeId) || ''}
        processingProps={PROCESSING_PROPS}
      />
    </>
  );
};

export default withRouter(RejectFioRequestPage);
