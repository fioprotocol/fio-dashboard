import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

import EdgeConfirmAction from '../EdgeConfirmAction';
import PseudoModalContainer from '../PseudoModalContainer';
import InfoBadge from '../InfoBadge/InfoBadge';
import { TransferForm } from './components/FioNameTransferForm/FioNameTransferForm';
import TransferResults from '../common/TransactionResults/components/TransferResults';

import { BADGE_TYPES } from '../Badge/Badge';
import { ERROR_TYPES } from '../common/TransactionResults/Results';
import { ROUTES } from '../../constants/routes';
import { fioNameLabels } from '../../constants/labels';
import {
  CONFIRM_PIN_ACTIONS,
  MANAGE_PAGE_REDIRECT,
} from '../../constants/common';

import { hasFioAddressDelimiter } from '../../utils';
import { setFees } from '../../util/prices';

import apis from '../../api';

import { ContainerProps } from './types';
import { FeePrice } from '../../types';
import { SubmitActionParams } from '../EdgeConfirmAction/types';
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
    currentWallet,
    fee,
    roe,
    history,
    name,
    fioNameType,
    refreshBalance,
    getFee,
  } = props;

  const feePrice: FeePrice = setFees(fee, roe);

  const [processing, setProcessing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitData, setSubmitData] = useState<{
    transferAddress: string;
  } | null>(null);
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);

  useEffect(() => {
    getFee(hasFioAddressDelimiter(name));
    refreshBalance(currentWallet.publicKey);
  }, []);

  useEffect(() => {
    if (!processing) {
      setSubmitting(false);
    }
  }, [processing]);

  const submit = async ({ keys, data }: SubmitActionParams) => {
    const { transferAddress } = data;
    let newOwnerKey = hasFioAddressDelimiter(transferAddress)
      ? ''
      : transferAddress;
    if (!newOwnerKey) {
      const {
        public_address: publicAddress,
      } = await apis.fio.getFioPublicAddress(transferAddress);
      if (!publicAddress) throw new Error('Public address is invalid.');
      newOwnerKey = publicAddress;
    }
    apis.fio.setWalletFioSdk(keys);
    try {
      const result = await apis.fio.transfer(
        name,
        newOwnerKey,
        feePrice.nativeFio,
      );
      apis.fio.clearWalletFioSdk();
      return { ...result, newOwnerKey };
    } catch (e) {
      apis.fio.clearWalletFioSdk();
      throw e;
    }
  };

  const onSubmit = (transferAddress: string) => {
    setSubmitData({ transferAddress });
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
      feeCollected: setFees(result.fee_collected, roe) || feePrice,
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
    );

  if (!currentWallet.publicKey && !processing)
    return <Redirect to={{ pathname: FIO_NAME_DATA[fioNameType].backLink }} />;

  const title = `Transfer FIO ${fioNameLabels[fioNameType]} Ownership`;

  return (
    <>
      <EdgeConfirmAction
        action={CONFIRM_PIN_ACTIONS.TRANSFER}
        setProcessing={setProcessing}
        onSuccess={onSuccess}
        onCancel={onCancel}
        processing={processing}
        data={submitData}
        submitAction={submit}
        fioWalletEdgeId={currentWallet.id || ''}
        edgeAccountLogoutBefore={true}
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
            onSubmit={onSubmit}
            processing={processing || submitting}
            feePrice={feePrice}
          />
        </div>
      </PseudoModalContainer>
    </>
  );
};
