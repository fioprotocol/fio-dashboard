import React, { useState, useEffect } from 'react';

import { FioRequestStatus } from '@fioprotocol/fiosdk';

import FioLoader from '../../components/common/FioLoader/FioLoader';
import PseudoModalContainer from '../../components/PseudoModalContainer';
import InfoBadge from '../../components/InfoBadge/InfoBadge';
import RequestTabs from './components/RequestTabs';
import RequestTokensEdgeWallet from './components/RequestTokensEdgeWallet';
import RequestTokensLedgerWallet from './components/RequestTokensLedgerWallet';
import TokenTransferResults from '../../components/common/TransactionResults/components/TokenTransferResults';
import WalletAction from '../../components/WalletAction/WalletAction';
import PageTitle from '../../components/PageTitle/PageTitle';
import { RequestTokensMetamaskWallet } from './components/RequestTokensMetamaskWallet';

import { LINKS } from '../../constants/labels';
import { FIO_CHAIN_CODE } from '../../constants/fio';
import { CONFIRM_PIN_ACTIONS } from '../../constants/common';
import { BADGE_TYPES } from '../../components/Badge/Badge';
import { emptyWallet } from '../../redux/fio/reducer';
import { ROUTES } from '../../constants/routes';
import { FIO_RECORD_TYPES } from '../WalletPage/constants';

import { useFioAddresses, usePubAddressesFromWallet } from '../../util/hooks';

import apis from '../../api';

import {
  ContainerProps,
  LocationProps,
  RequestTokensInitialValues,
  RequestTokensValues,
} from './types';
import {
  AnyObject,
  FioWalletDoublet,
  MappedPublicAddresses,
} from '../../types';
import { TrxResponsePaidBundles } from '../../api/fio';
import { ResultsData } from '../../components/common/TransactionResults/types';

import classes from './styles/RequestTokensPage.module.scss';

const RequestPage: React.FC<ContainerProps & LocationProps> = props => {
  const {
    feePrice,
    fioWallets,
    fioWalletsLoading,
    roe,
    history,
    contactsList,
    contactsLoading,
    location,
    createContact,
    getContactsList,
    refreshWalletDataPublicKey,
    getFee,
  } = props;

  const { state, query } = location;

  const payeeFioAddress = state?.payeeFioAddress;
  const publicKeyFromPath = query?.publicKey;

  const [fioWallet, setFioWallet] = useState<FioWalletDoublet | undefined>(
    emptyWallet,
  );
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);
  const [requestData, setRequestData] = useState<RequestTokensValues | null>(
    null,
  );
  const [processing, setProcessing] = useState<boolean>(false);

  const loading = fioWalletsLoading || contactsLoading;
  const isValidPublicKeyFromPath =
    publicKeyFromPath != null && publicKeyFromPath !== '';

  const [fioAddresses] = useFioAddresses(publicKeyFromPath);
  // todo: move getting mapped addresses to form on fio address selection
  const pubAddressesMap: MappedPublicAddresses = usePubAddressesFromWallet(
    publicKeyFromPath,
  );
  const initialValues: RequestTokensInitialValues = {
    payeeFioAddress: payeeFioAddress || '',
    chainCode: FIO_CHAIN_CODE,
    tokenCode: FIO_CHAIN_CODE,
    mapPubAddress: false,
  };

  useEffect(() => {
    setRequestData(null);
    getContactsList();
  }, []);

  useEffect(() => {
    if (requestData?.payeeFioAddress) {
      getFee(requestData.payeeFioAddress);
    }
  }, [requestData, getFee]);

  useEffect(() => {
    if (isValidPublicKeyFromPath) {
      setFioWallet(
        fioWallets.find(
          ({ publicKey: walletPublicKey }) =>
            walletPublicKey === publicKeyFromPath,
        ) || emptyWallet,
      );
    }
  }, [isValidPublicKeyFromPath, fioWallets, publicKeyFromPath]);

  const onRequest = async (values: RequestTokensValues) => {
    if (!isValidPublicKeyFromPath) {
      const fioAddress = fioAddresses.find(
        ({ name }) => name === values.payeeFioAddress,
      );
      setFioWallet(
        fioWallets.find(
          ({ publicKey: walletPublicKey }) =>
            walletPublicKey === fioAddress?.walletPublicKey,
        ),
      );
    }
    setRequestData(values);
  };

  const onCancel = () => {
    setRequestData(null);
    setProcessing(false);
  };
  const onSuccess = (res: TrxResponsePaidBundles) => {
    setRequestData(null);
    setProcessing(false);
    setResultsData({
      name: fioWallet?.name,
      publicKey: fioWallet?.publicKey,
      bundlesCollected: res.bundlesCollected,
      other: {
        ...requestData,
        amount: requestData?.amount,
        nativeAmount: apis.fio.amountToSUF(requestData?.amount),
        ...res,
        toFioAddress: requestData?.payerFioAddress,
        fromFioAddress: requestData?.payeeFioAddress,
      },
    });
    refreshWalletDataPublicKey(fioWallet?.publicKey);
  };

  const onResultsRetry = () => {
    setResultsData(null);
  };

  const onBack = () => {
    history.goBack();
  };

  const onCancelRequest = () => {
    history.push(ROUTES.CANCEL_FIO_REQUEST, {
      fioRecordDecrypted: {
        fioRecord: {
          id: resultsData.other.fio_request_id,
          from: resultsData.other.fromFioAddress,
          to: resultsData.other.toFioAddress,
          payeeFioPublicKey: resultsData.other.payeeTokenPublicAddress,
          date: resultsData.other.block_time,
          status: FioRequestStatus.requested,
          fioTxType: FIO_RECORD_TYPES.SENT,
        },
        fioDecryptedContent: {
          payeePublicAddress: resultsData.other.payeeTokenPublicAddress,
          amount: resultsData.other.amount,
          chainCode: resultsData.other.chainCode,
          tokenCode: resultsData.other.tokenCode,
          memo: resultsData.other.memo,
        },
      },
      fioWallet,
      fioRecordType: FIO_RECORD_TYPES.SENT,
    } as AnyObject);
  };

  if (isValidPublicKeyFromPath && (!fioWallet || !fioWallet.id)) {
    return <FioLoader wrap={true} />;
  }

  if (resultsData)
    return (
      <>
        <PageTitle link={LINKS.FIO_TOKENS_REQUEST_CONFIRMATION} isVirtualPage />
        <TokenTransferResults
          results={resultsData}
          title={resultsData.error ? 'Request not Sent' : 'Request Sent'}
          titleTo="Request Sent To"
          titleFrom="Requesting FIO Handle"
          titleAmount="Amount Requested"
          roe={roe}
          onClose={onBack}
          onRetry={onResultsRetry}
          onCancel={onCancelRequest}
        />
      </>
    );

  return (
    <>
      <WalletAction
        fee={feePrice.nativeFio}
        fioWallet={fioWallet}
        onCancel={onCancel}
        onSuccess={onSuccess}
        action={CONFIRM_PIN_ACTIONS.REQUEST}
        submitData={requestData}
        processing={processing}
        setProcessing={setProcessing}
        createContact={createContact}
        contactsList={contactsList}
        FioActionWallet={RequestTokensEdgeWallet}
        MetamaskActionWallet={RequestTokensMetamaskWallet}
        LedgerActionWallet={RequestTokensLedgerWallet}
      />

      <PseudoModalContainer
        title="Request FIO Tokens"
        onBack={onBack}
        middleWidth={true}
      >
        {isValidPublicKeyFromPath ? (
          <p className={classes.subtitle}>
            <span className={classes.subtitleThin}>FIO Wallet Name:</span>{' '}
            {fioWallet?.name}
          </p>
        ) : null}

        <div className="mb-4">
          <InfoBadge
            type={BADGE_TYPES.INFO}
            show={true}
            title="Requesting FIO Handle "
            message="You may use any of your FIO Handles associated with the wallet to create a FIO token request."
          />
        </div>

        <RequestTabs
          initialValues={initialValues}
          loading={loading || processing}
          fioAddresses={fioAddresses}
          pubAddressesMap={pubAddressesMap}
          onSubmit={onRequest}
          contactsList={contactsList}
        />
      </PseudoModalContainer>
    </>
  );
};

export default RequestPage;
