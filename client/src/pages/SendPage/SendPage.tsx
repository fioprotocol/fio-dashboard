import React, { useState, useEffect } from 'react';

import FioLoader from '../../components/common/FioLoader/FioLoader';
import PseudoModalContainer from '../../components/PseudoModalContainer';
import InfoBadge from '../../components/InfoBadge/InfoBadge';
import SendTokensForm from './components/SendTokensForm';
import SendEdgeWallet from './components/SendEdgeWallet';
import TokenTransferResults from '../../components/common/TransactionResults/components/TokenTransferResults';

import { putParamsToUrl } from '../../utils';
import { fioAddressToPubKey } from '../../util/fio';

import { ContainerProps, SendTokensValues, InitialValues } from './types';
import { TrxResponsePaidBundles } from '../../api/fio';
import { ResultsData } from '../../components/common/TransactionResults/types';

import { BADGE_TYPES } from '../../components/Badge/Badge';
import { ROUTES } from '../../constants/routes';
import { WALLET_CREATED_FROM } from '../../constants/common';
import { FIO_RECORD_TYPES } from '../WalletPage/constants';

import { useFioAddresses } from '../../util/hooks';

import classes from './styles/SendPage.module.scss';
import { convertFioPrices } from '../../util/prices';

const SendPage: React.FC<ContainerProps> = props => {
  const {
    fioWallet,
    balance,
    loading,
    feePrice,
    roe,
    history,
    contactsList = [],
    location: { state: { fioRecordDecrypted } = {} },
    refreshBalance,
    getFee,
    createContact,
    getContactsList,
    refreshWalletDataPublicKey,
  } = props;

  const [resultsData, setResultsData] = useState<ResultsData | null>(null);
  const [sendData, setSendData] = useState<SendTokensValues | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);

  const [walletFioAddresses] = useFioAddresses(
    fioWallet && fioWallet.publicKey,
  );

  useEffect(() => {
    getFee();
    setSendData(null);
    getContactsList();
  }, []);

  useEffect(() => {
    if (fioWallet && fioWallet.publicKey) refreshBalance(fioWallet.publicKey);
  }, [fioWallet]);

  const onSend = async (values: SendTokensValues) => {
    const newSendData = { ...values };

    if (newSendData.toPubKey) return setSendData(newSendData);

    const pubKey = await fioAddressToPubKey(newSendData.to);

    if (pubKey) {
      newSendData.toPubKey = pubKey;
    } else {
      newSendData.toPubKey = newSendData.to;
      newSendData.to = '';
    }

    setSendData(newSendData);
  };
  const onCancel = () => {
    setSendData(null);
    setProcessing(false);
  };
  const onSuccess = (res: TrxResponsePaidBundles) => {
    setSendData(null);
    setProcessing(false);
    setResultsData({
      feeCollected: convertFioPrices(res.fee_collected, roe),
      bundlesCollected: res.bundlesCollected,
      name: fioWallet.publicKey,
      publicKey: fioWallet.publicKey,
      other: {
        ...sendData,
        ...res,
        to: sendData?.toPubKey,
        toFioAddress: sendData?.to,
        fromFioAddress: sendData?.from,
        from: sendData?.fromPubKey,
        fioRequestId: fioRecordDecrypted?.fioRecord.id,
      },
    });
    refreshWalletDataPublicKey(fioWallet.publicKey);
  };

  const onResultsRetry = () => {
    setResultsData(null);
  };
  const onResultsClose = () => {
    history.push(
      putParamsToUrl(ROUTES.FIO_WALLET, { publicKey: fioWallet.publicKey }),
      {
        fioRequestTab: fioRecordDecrypted && FIO_RECORD_TYPES.RECEIVED,
      },
    );
  };

  if (!fioWallet || !fioWallet.id) return <FioLoader wrap={true} />;

  const onBack = () =>
    history.push(
      putParamsToUrl(ROUTES.FIO_WALLET, {
        publicKey: fioWallet.publicKey,
      }),
      {
        fioRequestTab: fioRecordDecrypted && FIO_RECORD_TYPES.RECEIVED,
        fioRecordDecrypted,
      },
    );

  const renderInfoBadge = () =>
    walletFioAddresses.length ? (
      <InfoBadge
        type={BADGE_TYPES.INFO}
        show={true}
        title="Sending FIO Crypto Handle"
        message="You may use any of your FIO Crypto Handles associated with this wallet to send FIO Tokens"
      />
    ) : null;

  const initialValues: InitialValues = {
    // From and To replaces each other because we are sending To address from which we got request
    fromPubKey: fioWallet.publicKey,
    toPubKey: fioRecordDecrypted?.fioDecryptedContent?.payeePublicAddress,
    from: fioRecordDecrypted?.fioRecord.to || walletFioAddresses[0]?.name,
    to: fioRecordDecrypted?.fioRecord.from,
    fioRequestId: fioRecordDecrypted?.fioRecord.id,
    amount: fioRecordDecrypted?.fioDecryptedContent?.amount,
    memo: fioRecordDecrypted?.fioDecryptedContent?.memo,
  };

  if (resultsData)
    return (
      <TokenTransferResults
        results={resultsData}
        title={resultsData.error ? 'FIO Tokens not Sent' : 'FIO Tokens Sent'}
        roe={roe}
        onClose={onResultsClose}
        onRetry={onResultsRetry}
      />
    );

  return (
    <>
      {fioWallet.from === WALLET_CREATED_FROM.EDGE ? (
        <SendEdgeWallet
          fioWallet={fioWallet}
          fee={feePrice.nativeFio}
          onCancel={onCancel}
          onSuccess={onSuccess}
          sendData={sendData}
          processing={processing}
          setProcessing={setProcessing}
          createContact={createContact}
          contactsList={contactsList}
        />
      ) : null}

      <PseudoModalContainer
        title="Send FIO Tokens"
        onBack={onBack || null}
        middleWidth={true}
      >
        <p className={classes.subtitle}>
          <span className={classes.subtitleThin}>FIO Wallet Name:</span>{' '}
          {fioWallet.name}
        </p>

        {renderInfoBadge()}

        <SendTokensForm
          fioWallet={fioWallet}
          balance={balance}
          loading={loading || processing}
          fioAddresses={walletFioAddresses}
          onSubmit={onSend}
          fee={feePrice}
          obtDataOn={true}
          contactsList={contactsList}
          initialValues={initialValues}
        />
      </PseudoModalContainer>
    </>
  );
};

export default SendPage;
