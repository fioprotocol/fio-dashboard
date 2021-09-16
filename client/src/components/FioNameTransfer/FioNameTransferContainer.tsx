import React, { useEffect, useState } from 'react';

import PseudoModalContainer from '../PseudoModalContainer';
import { BADGE_TYPES } from '../Badge/Badge';
import InfoBadge from '../InfoBadge/InfoBadge';
import { TransferForm } from './FioNameTransferForm';
import Results from '../common/TransactionResults';

import { ROUTES } from '../../constants/routes';
import { ContainerProps, TransferParams } from './types';
import { fioNameLabels } from '../../constants/labels';
import {
  CONFIRM_PIN_ACTIONS,
  MANAGE_PAGE_REDIRECT,
} from '../../constants/common';
import { hasFioAddressDelimiter, waitForEdgeAccountStop } from '../../utils';
import { PinConfirmation } from '../../types';
import Processing from '../common/TransactionProcessing';
import { Redirect } from 'react-router-dom';
import { TRANSFER_REQUEST } from '../../redux/fio/actions';
import { ResultsData } from '../common/TransactionResults/types';

import classes from './FioNameTransferContainer.module.scss';

const FIO_NAME_DATA = {
  address: {
    infoMessage: 'Transferring a FIO Address will purge all linked wallets',
    backLink: ROUTES.FIO_ADDRESSES,
    forwardLink: ROUTES.FIO_ADDRESS_TRANSFER_RESULTS,
  },
  domain: {
    infoMessage:
      'Transferring a FIO Domain will not transfer ownership of FIO Addresses on that Domain',
    backLink: ROUTES.FIO_DOMAINS,
    forwardLink: ROUTES.FIO_DOMAIN_TRANSFER_RESULTS,
  },
};

export const FioNameTransferContainer: React.FC<ContainerProps> = props => {
  const {
    walletPublicKey,
    currentWallet,
    feePrice,
    history,
    name,
    pageName,
    transferProcessing,
    refreshBalance,
    pinConfirmation,
    transfer,
    result: trxResult,
    getFee,
    getPrices,
    showPinModal,
    resetPinConfirm,
  } = props;

  const [processing, setProcessing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);

  useEffect(() => {
    getPrices();
    getFee(hasFioAddressDelimiter(name));
    refreshBalance(walletPublicKey);
  }, []);

  // Handle pin confirmation
  useEffect(() => {
    submit(pinConfirmation);
  }, [pinConfirmation]);

  useEffect(() => {
    if (!processing) {
      setSubmitting(false);
    }
  }, [processing]);

  // Handle results
  useEffect(() => {
    if (!transferProcessing && processing) {
      const {
        data: { transferAddress },
      } = pinConfirmation;
      resetPinConfirm();

      setResultsData({
        feeCollected: trxResult.feeCollected || feePrice,
        name,
        publicKey:
          trxResult.newOwnerKey ||
          (hasFioAddressDelimiter(transferAddress) ? '' : transferAddress),
        error: trxResult.error,
      });
      setProcessing(false);
    }
  }, [transferProcessing, trxResult]);

  const submit = async (pinConfirmation: PinConfirmation) => {
    const {
      account: edgeAccount,
      keys: walletKeys,
      error: confirmationError,
      action: confirmationAction,
      data,
    } = pinConfirmation;

    if (confirmationAction !== CONFIRM_PIN_ACTIONS.TRANSFER) return;
    if (
      walletKeys &&
      walletKeys[currentWallet.id] &&
      !confirmationError &&
      !transferProcessing &&
      !processing
    ) {
      setProcessing(true);
      const { transferAddress } = data;
      await waitForEdgeAccountStop(edgeAccount);
      const transferParams: TransferParams = {
        fioName: name,
        fee: feePrice.nativeFio,
        keys: walletKeys[currentWallet.id],
        ...(hasFioAddressDelimiter(transferAddress)
          ? { newOwnerFioAddress: transferAddress }
          : { newOwnerKey: transferAddress }),
      };

      transfer(transferParams);
    }

    if (confirmationError) setProcessing(false);
  };

  const onSubmit = (transferAddress: string) => {
    showPinModal(CONFIRM_PIN_ACTIONS.TRANSFER, { transferAddress });
  };

  const onResultsClose = () => {
    history.push(MANAGE_PAGE_REDIRECT[pageName]);
  };

  const onResultsRetry = () => {
    setResultsData(null);
  };

  if (resultsData)
    return (
      <Results
        results={resultsData}
        title={
          resultsData.error
            ? 'Ownership Transfer Failed!'
            : 'Ownership Transferred!'
        }
        actionName={TRANSFER_REQUEST}
        pageName={pageName}
        onClose={onResultsClose}
        onRetry={onResultsRetry}
      />
    );

  if (!walletPublicKey && !processing)
    return <Redirect to={{ pathname: FIO_NAME_DATA[pageName].backLink }} />;

  const title = `Transfer FIO ${fioNameLabels[pageName]} Ownership`;

  return (
    <PseudoModalContainer link={FIO_NAME_DATA[pageName].backLink} title={title}>
      <div className={classes.container}>
        <InfoBadge
          message={FIO_NAME_DATA[pageName].infoMessage}
          title="Important Information"
          type={BADGE_TYPES.INFO}
          show={true}
        />
        <TransferForm
          {...props}
          onSubmit={onSubmit}
          processing={processing || submitting}
        />
        <Processing isProcessing={processing} />
      </div>
    </PseudoModalContainer>
  );
};
