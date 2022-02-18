import React, { useState, useEffect } from 'react';

import FioLoader from '../../components/common/FioLoader/FioLoader';
import PseudoModalContainer from '../../components/PseudoModalContainer';
import InfoBadge from '../../components/InfoBadge/InfoBadge';
import RequestTabs from './components/RequestTabs';
import RequestTokensEdgeWallet from './components/RequestTokensEdgeWallet';
import TokenTransferResults from '../../components/common/TransactionResults/components/TokenTransferResults';

import { useFioAddresses, usePubAddressesFromWallet } from '../../util/hooks';

import {
  ContainerProps,
  RequestTokensInitialValues,
  RequestTokensValues,
} from './types';
import { FioWalletDoublet, MappedPublicAddresses } from '../../types';
import { TrxResponse } from '../../api/fio';
import { ResultsData } from '../../components/common/TransactionResults/types';

import apis from '../../api';

import { BADGE_TYPES } from '../../components/Badge/Badge';
import { WALLET_CREATED_FROM } from '../../constants/common';
import { FIO_CHAIN_CODE } from '../../constants/fio';
import { emptyWallet } from '../../redux/fio/reducer';

import classes from './styles/RequestTokensPage.module.scss';

const RequestPage: React.FC<ContainerProps> = props => {
  const {
    fioWallets,
    fioWalletsLoading,
    roe,
    history,
    contactsList,
    contactsLoading,
    location: { state: { payeeFioAddress } = {} },
    match: {
      params: { publicKey: publicKeyFromPath },
    },
    createContact,
    getContactsList,
    refreshWalletDataPublicKey,
  } = props;

  const [fioWallet, setFioWallet] = useState<FioWalletDoublet>(emptyWallet);
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);
  const [requestData, setRequestData] = useState<RequestTokensValues | null>(
    null,
  );
  const [processing, setProcessing] = useState<boolean>(false);

  const loading = fioWalletsLoading || contactsLoading;

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
    if (publicKeyFromPath != null) {
      setFioWallet(
        fioWallets.find(
          ({ publicKey: walletPublicKey }) =>
            walletPublicKey === publicKeyFromPath,
        ) || emptyWallet,
      );
    }
  }, [publicKeyFromPath]);

  const onRequest = async (values: RequestTokensValues) => {
    if (publicKeyFromPath == null) {
      const fioAddress = fioAddresses.find(
        ({ name }) => name === values.payeeFioAddress,
      );
      setFioWallet(
        fioWallets.find(
          ({ publicKey: walletPublicKey }) =>
            walletPublicKey === fioAddress.walletPublicKey,
        ),
      );
    }
    setRequestData(values);
  };

  const onCancel = () => {
    setRequestData(null);
    setProcessing(false);
  };
  const onSuccess = (res: TrxResponse & { bundlesCollected?: number }) => {
    setRequestData(null);
    setProcessing(false);
    setResultsData({
      name: fioWallet.name,
      publicKey: fioWallet.publicKey,
      bundlesCollected: res.bundlesCollected,
      other: {
        ...requestData,
        amount: requestData.amount,
        nativeAmount: apis.fio
          .amountToSUF(Number(requestData.amount))
          .toString(),
        ...res,
        toFioAddress: requestData.payerFioAddress,
        fromFioAddress: requestData.payeeFioAddress,
      },
    });
    refreshWalletDataPublicKey(fioWallet.publicKey);
  };

  const onResultsRetry = () => {
    setResultsData(null);
  };

  if (publicKeyFromPath != null && (!fioWallet || !fioWallet.id))
    return (
      <div className="d-flex justify-content-center align-items-center w-100 flex-grow-1">
        <FioLoader />
      </div>
    );

  if (resultsData)
    return (
      <TokenTransferResults
        results={resultsData}
        title={resultsData.error ? 'Request not Sent' : 'Request Sent'}
        titleTo="Request Sent To"
        titleFrom="Requesting FIO Crypto Handle"
        titleAmount="Amount Requested"
        roe={roe}
        onClose={history.goBack}
        onRetry={onResultsRetry}
      />
    );

  return (
    <>
      {fioWallet.publicKey != null &&
      fioWallet.from === WALLET_CREATED_FROM.EDGE ? (
        <RequestTokensEdgeWallet
          fioWallet={fioWallet}
          onCancel={onCancel}
          onSuccess={onSuccess}
          requestData={requestData}
          processing={processing}
          setProcessing={setProcessing}
          createContact={createContact}
          contactsList={contactsList}
        />
      ) : null}
      <PseudoModalContainer
        title="Request FIO Tokens"
        onBack={history.goBack}
        middleWidth={true}
      >
        {publicKeyFromPath != null ? (
          <p className={classes.subtitle}>
            <span className={classes.subtitleThin}>FIO Wallet Name:</span>{' '}
            {fioWallet.name}
          </p>
        ) : null}

        <div className="mb-4">
          <InfoBadge
            type={BADGE_TYPES.INFO}
            show={true}
            title="Requesting FIO Crypto Handle "
            message="You may use any of your FIO Crypto Handles associated with the wallet to create a FIO token request."
          />
        </div>

        <RequestTabs
          initialValues={initialValues}
          roe={roe}
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
