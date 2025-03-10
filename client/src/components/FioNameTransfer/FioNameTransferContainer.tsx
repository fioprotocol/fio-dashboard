import React, { useCallback, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

import WalletAction from '../WalletAction/WalletAction';
import PseudoModalContainer from '../PseudoModalContainer';
import InfoBadge from '../InfoBadge/InfoBadge';
import { TransferForm } from './components/FioNameTransferForm/FioNameTransferForm';
import TransferResults from '../common/TransactionResults/components/TransferResults';
import FioNameTransferEdgeWallet from './components/FioNameTransferEdgeWallet';
import FioNameTransferLedgerWallet from './components/FioNameTransferLedgerWallet';
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
} from '../../constants/common';

import { hasFioAddressDelimiter } from '../../utils';
import { convertFioPrices } from '../../util/prices';
import {
  handleFioServerResponse,
  handleFioServerResponseActionData,
} from '../../util/fio';
import { log } from '../../util/general';
import apis from '../../api';

import { ContainerProps, FioNameTransferValues } from './types';
import { ResultsData } from '../common/TransactionResults/types';
import { OnSuccessResponseResult } from '../MetamaskConfirmAction';

import { useWalletBalances } from '../../util/hooks';

import classes from './FioNameTransferContainer.module.scss';

const FIO_NAME_DATA = {
  address: {
    infoMessage:
      'Transferring of a FIO Handle will purge all NFT signatures, linked social media accounts and linked wallets.',
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

  const [submitData, setSubmitData] = useState<FioNameTransferValues | null>(
    null,
  );
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);
  const { publicKey } = currentWallet;

  const { available: walletBalancesAvailable } = useWalletBalances(
    currentWallet.publicKey,
  );

  const setNewOwnerPublicKeyFn = useCallback(
    async (transferAddress: string) => {
      try {
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

        setSubmitData({ name, fioNameType, newOwnerPublicKey: newOwnerKey });
      } catch (error) {
        log.error(error);
        setSubmitting(false);
      }
    },
    [name, fioNameType],
  );

  useEffect(() => {
    if (name && publicKey) {
      getFee(hasFioAddressDelimiter(name));
      refreshBalance(publicKey);
    }
  }, [name, publicKey, refreshBalance, getFee]);

  useEffect(() => {
    if (!processing) {
      setSubmitting(false);
    }
  }, [processing]);

  const onSubmit = (transferAddress: string) => {
    setNewOwnerPublicKeyFn(transferAddress);
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
          fee_collected: string;
          newOwnerKey?: string;
          newOwnerFioAddress?: string;
        }
      | OnSuccessResponseResult,
  ) => {
    setSubmitData(null);

    let feeCollected: string;
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
      payWith: {
        walletName: currentWallet.name,
        walletBalances: walletBalancesAvailable,
      },
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
        MetamaskActionWallet={FioNameTransferMetamaskWallet}
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
            messageClassName={classes.infoMessage}
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
