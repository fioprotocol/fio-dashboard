import React, { useCallback, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

import EdgeConfirmAction from '../EdgeConfirmAction';
import PseudoModalContainer from '../PseudoModalContainer';
import InfoBadge from '../InfoBadge/InfoBadge';
import { TransferForm } from './components/FioNameTransferForm/FioNameTransferForm';
import TransferResults from '../common/TransactionResults/components/TransferResults';
import LedgerWalletActionNotSupported from '../LedgerWalletActionNotSupported';
import PageTitle from '../PageTitle/PageTitle';
import { FioNameTransferMetamaskWallet } from './components/FioNameTransferMetamaskWallet';

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
  WALLET_CREATED_FROM,
} from '../../constants/common';
import { ACTIONS, DEFAULT_MAX_FEE_MULTIPLE_AMOUNT } from '../../constants/fio';

import { hasFioAddressDelimiter, isDomain } from '../../utils';
import { convertFioPrices } from '../../util/prices';
import MathOp from '../../util/math';
import {
  handleFioServerResponse,
  handleFioServerResponseActionData,
} from '../../util/fio';
import { log } from '../../util/general';

import apis from '../../api';

import { ContainerProps } from './types';
import { SubmitActionParams } from '../EdgeConfirmAction/types';
import { ResultsData } from '../common/TransactionResults/types';
import { FioNameType } from '../../types';
import { OnSuccessResponseResult } from '../MetamaskConfirmAction';

import classes from './FioNameTransferContainer.module.scss';

const FIO_NAME_DATA = {
  address: {
    infoMessage: 'Transferring a FIO Handle will purge all linked wallets',
    backLink: ROUTES.FIO_ADDRESSES,
    forwardLink: ROUTES.FIO_ADDRESS_TRANSFER_RESULTS,
  },
  domain: {
    infoMessage:
      'Transferring a FIO Domain will not transfer ownership of FIO Handles on that Domain',
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
  const [submitData, setSubmitData] = useState<{
    transferAddress: string;
    fioNameType: FioNameType;
  } | null>(null);
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);
  const [newOwnerPublicKey, setNewOwnerPublicKey] = useState<string | null>(
    null,
  );

  const { publicKey, edgeId } = currentWallet;

  const setNewOwnerPublicKeyFn = useCallback(async () => {
    try {
      const { transferAddress } = submitData || {};
      if (!transferAddress) return;

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

      setNewOwnerPublicKey(newOwnerKey);
    } catch (error) {
      log.error(error);
    }
  }, [submitData]);

  useEffect(() => {
    setNewOwnerPublicKeyFn();
  }, [setNewOwnerPublicKeyFn]);

  useEffect(() => {
    getFee(hasFioAddressDelimiter(name));
    refreshBalance(publicKey);
  }, [name, publicKey, refreshBalance, getFee]);

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
    const result = await apis.fio.executeAction(
      keys,
      isDomain(name) ? ACTIONS.transferFioDomain : ACTIONS.transferFioAddress,
      isDomain(name)
        ? {
            fioDomain: name,
            newOwnerKey,
            maxFee: new MathOp(feePrice.nativeFio)
              .mul(DEFAULT_MAX_FEE_MULTIPLE_AMOUNT)
              .round(0)
              .toNumber(),
          }
        : {
            fioAddress: name,
            newOwnerKey,
            maxFee: new MathOp(feePrice.nativeFio)
              .mul(DEFAULT_MAX_FEE_MULTIPLE_AMOUNT)
              .round(0)
              .toNumber(),
          },
    );
    return { ...result, newOwnerKey };
  };

  const onSubmit = (transferAddress: string) => {
    setSubmitData({ transferAddress, fioNameType });
    setSubmitting(true);
  };
  const onCancel = () => {
    setSubmitData(null);
    setProcessing(false);
    setSubmitting(false);
  };
  const onSuccess = (
    result:
      | {
          fee_collected: number;
          newOwnerKey?: string;
          newOwnerFioAddress?: string;
        }
      | OnSuccessResponseResult,
  ) => {
    setSubmitData(null);

    let feeCollected: number;
    let publicKey: string;

    if ('fee_collected' in result) {
      feeCollected = result.fee_collected;
      publicKey = result.newOwnerKey || result.newOwnerFioAddress;
    } else {
      if (!Array.isArray(result) && 'transaction_id' in result) {
        feeCollected = handleFioServerResponse(result).fee_collected;
        publicKey = handleFioServerResponseActionData(result)
          .new_owner_fio_public_key;
      }
    }

    setResultsData({
      feeCollected: feeCollected
        ? convertFioPrices(feeCollected, roe)
        : feePrice,
      name,
      publicKey,
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
      {currentWallet.from === WALLET_CREATED_FROM.EDGE ? (
        <EdgeConfirmAction
          action={CONFIRM_PIN_ACTIONS.TRANSFER}
          setProcessing={setProcessing}
          onSuccess={onSuccess}
          onCancel={onCancel}
          processing={processing}
          data={submitData}
          submitAction={submit}
          fioWalletEdgeId={edgeId || ''}
          edgeAccountLogoutBefore={true}
        />
      ) : null}

      {currentWallet.from === WALLET_CREATED_FROM.LEDGER ? (
        <LedgerWalletActionNotSupported
          submitData={submitData}
          onCancel={onCancel}
        />
      ) : null}

      {currentWallet.from === WALLET_CREATED_FROM.METAMASK ? (
        <FioNameTransferMetamaskWallet
          derivationIndex={currentWallet?.data?.derivationIndex}
          processing={processing}
          submitData={{
            fioName: name,
            newOwnerPublicKey,
          }}
          fioNameType={submitData?.fioNameType}
          startProcessing={!!submitData && !!newOwnerPublicKey}
          onSuccess={onSuccess}
          onCancel={onCancel}
          setProcessing={setProcessing}
        />
      ) : null}

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
