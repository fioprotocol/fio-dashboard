import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

import WalletAction from '../WalletAction/WalletAction';
import PseudoModalContainer from '../PseudoModalContainer';
import InfoBadge from '../InfoBadge/InfoBadge';
import { TransferForm } from './components/FioNameTransferForm/FioNameTransferForm';
import TransferResults from '../common/TransactionResults/components/TransferResults';
import FioNameTransferEdgeWallet from './components/FioNameTransferEdgeWallet';
import FioNameTransferLedgerWallet from './components/FioNameTransferLedgerWallet';
import PageTitle from '../PageTitle/PageTitle';

import { BADGE_TYPES } from '../Badge/Badge';
import { ERROR_TYPES } from '../common/TransactionResults/constants';
import { ROUTES } from '../../constants/routes';
import {
  fioNameLabels,
  TRANSFER_PAGE_CONFIRMATION_LINK,
} from '../../constants/labels';
import {
  CONFIRM_PIN_ACTIONS,
  MANAGE_PAGE_REDIRECT,
} from '../../constants/common';

import { hasFioAddressDelimiter } from '../../utils';
import { convertFioPrices } from '../../util/prices';

import { ContainerProps, FioNameTransferValues } from './types';
import { ResultsData } from '../common/TransactionResults/types';

import classes from './FioNameTransferContainer.module.scss';

const FIO_NAME_DATA = {
  address: {
    infoMessage:
      'Transferring a FIO Crypto Handle will purge all linked wallets',
    backLink: ROUTES.FIO_ADDRESSES,
    forwardLink: ROUTES.FIO_ADDRESS_TRANSFER_RESULTS,
  },
  domain: {
    infoMessage:
      'Transferring a FIO Domain will not transfer ownership of FIO Crypto Handles on that Domain',
    backLink: ROUTES.FIO_DOMAINS,
    forwardLink: ROUTES.FIO_DOMAIN_TRANSFER_RESULTS,
  },
};

export const FioNameTransferContainer: React.FC<ContainerProps> = props => {
  const {
    currentWallet,
    feePrice,
    roe,
    history,
    name,
    fioNameType,
    refreshBalance,
    getFee,
  } = props;

  const [processing, setProcessing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitData, setSubmitData] = useState<FioNameTransferValues | null>(
    null,
  );
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);

  const { publicKey } = currentWallet;

  useEffect(() => {
    getFee(hasFioAddressDelimiter(name));
    refreshBalance(publicKey);
  }, [name, publicKey, refreshBalance, getFee]);

  useEffect(() => {
    if (!processing) {
      setSubmitting(false);
    }
  }, [processing]);

  const onSubmit = (transferAddress: string) => {
    setSubmitData({ name, transferAddress, fioNameType });
    setSubmitting(true);
  };
  const onCancel = () => {
    setSubmitData(null);
    setProcessing(false);
    setSubmitting(false);
  };
  const onSuccess = (result: {
    fee_collected: number;
    newOwnerKey?: string;
    newOwnerFioAddress?: string;
  }) => {
    setSubmitData(null);
    setResultsData({
      feeCollected: convertFioPrices(result.fee_collected, roe) || feePrice,
      name,
      publicKey: result.newOwnerKey || result.newOwnerFioAddress,
    });
    setProcessing(false);
  };

  const onResultsClose = () => {
    history.push(MANAGE_PAGE_REDIRECT[fioNameType]);
  };

  const onResultsRetry = () => {
    setResultsData(null);
  };

  if (resultsData)
    return (
      <>
        <PageTitle
          link={TRANSFER_PAGE_CONFIRMATION_LINK[fioNameType]}
          isVirtualPage
        />
        <TransferResults
          pageName={fioNameType}
          results={resultsData}
          title={
            resultsData.error
              ? 'Ownership Transfer Failed!'
              : 'Ownership Transferred!'
          }
          hasAutoWidth={true}
          onClose={onResultsClose}
          onRetry={onResultsRetry}
          errorType={ERROR_TYPES.TRANSFER_ERROR}
        />
      </>
    );

  if (!publicKey && !processing)
    return <Redirect to={{ pathname: FIO_NAME_DATA[fioNameType].backLink }} />;

  const title = `Transfer ${fioNameLabels[fioNameType]} Ownership`;

  return (
    <>
      <WalletAction
        fioWallet={currentWallet}
        fee={feePrice.nativeFio}
        onCancel={onCancel}
        onSuccess={onSuccess}
        submitData={submitData}
        processing={processing}
        setProcessing={setProcessing}
        action={CONFIRM_PIN_ACTIONS.TRANSFER}
        FioActionWallet={FioNameTransferEdgeWallet}
        LedgerActionWallet={FioNameTransferLedgerWallet}
      />

      <PseudoModalContainer
        link={FIO_NAME_DATA[fioNameType].backLink}
        title={title}
      >
        <div className={classes.container}>
          <InfoBadge
            message={FIO_NAME_DATA[fioNameType].infoMessage}
            title="Important Information"
            type={BADGE_TYPES.INFO}
            show={true}
          />
          <TransferForm
            {...props}
            walletName={currentWallet ? currentWallet.name : ''}
            onSubmit={onSubmit}
            processing={processing || submitting}
            feePrice={feePrice}
            publicKey={publicKey}
          />
        </div>
      </PseudoModalContainer>
    </>
  );
};
