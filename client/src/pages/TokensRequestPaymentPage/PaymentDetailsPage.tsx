import React, { useState, useEffect } from 'react';
import { useLocation, useParams, Redirect } from 'react-router-dom';

import PseudoModalContainer from '../../components/PseudoModalContainer';
import InfoBadge from '../../components/InfoBadge/InfoBadge';
import PaymentDetailsForm from './components/PaymentDetailsForm';
import PaymentDetailsEdgeWallet from './components/PaymentDetailsEdgeWallet';
import PaymentDetailsResults from '../../components/common/TransactionResults/components/PaymentDetailsResults';

import { putParamsToUrl } from '../../utils';

import {
  ContainerProps,
  PaymentDetailsResultValues,
  PaymentDetailsValues,
  PaymentDetailsInitialValues,
  TxValues,
} from './types';

import { BADGE_TYPES } from '../../components/Badge/Badge';
import { ROUTES } from '../../constants/routes';
import { WALLET_CREATED_FROM } from '../../constants/common';
import { FioAddressDoublet, FioWalletDoublet } from '../../types';
import { useFioAddresses } from '../../util/hooks';
import FioLoader from '../../components/common/FioLoader/FioLoader';
import { FioRecordViewDecrypted } from '../WalletPage/types';
import { isFioChain } from '../../util/fio';
import { FIO_RECORD_TYPES } from '../WalletPage/constants';

const PaymentDetailsPage: React.FC<ContainerProps> = props => {
  const {
    history,
    contactsList,
    loading,
    createContact,
    getContactsList,
    refreshWalletDataPublicKey,
  } = props;

  const [
    resultsData,
    setResultsData,
  ] = useState<PaymentDetailsResultValues | null>(null);

  const [sendData, setSendData] = useState<PaymentDetailsValues | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [
    initialValues,
    setInitialValues,
  ] = useState<PaymentDetailsInitialValues | null>(null);

  const {
    fioRequestId,
    publicKey,
  }: { fioRequestId?: string; publicKey?: string } = useParams();
  const location: {
    state: {
      fioWallet: FioWalletDoublet;
      fioRecordDecrypted: FioRecordViewDecrypted;
    };
  } = useLocation();

  const { fioWallet, fioRecordDecrypted } = location.state || {};

  const { memo, amount, chainCode, payeePublicAddress, tokenCode } =
    fioRecordDecrypted?.fioDecryptedContent || {};

  useEffect(() => {
    setSendData(null);
  }, []);

  useEffect(() => {
    if (fioWallet?.id) getContactsList();
  }, [JSON.stringify(fioWallet)]);

  useEffect(() => {
    if (
      fioRecordDecrypted?.fioRecord &&
      fioRecordDecrypted?.fioDecryptedContent
    )
      setInitialValues({
        payerFioAddress: fioRecordDecrypted.fioRecord.to,
        payeeFioAddress: fioRecordDecrypted.fioRecord.from,
        payeeFioPublicKey: fioRecordDecrypted.fioRecord.payeeFioPublicKey,
        payeePublicAddress,
        memo,
        amount,
        chainCode,
        tokenCode,
        obtId: '',
        fioRequestId: fioRecordDecrypted.fioRecord.id,
      });
  }, [JSON.stringify(fioRecordDecrypted)]);

  const onSend = async (values: PaymentDetailsValues) => {
    setSendData({ ...values });
  };
  const onCancel = () => {
    setSendData(null);
    setProcessing(false);
  };
  const onSuccess = (res: TxValues & { error?: string }) => {
    !res.error && refreshWalletDataPublicKey(fioWallet.publicKey);
    setSendData(null);
    setProcessing(false);
    setResultsData({
      ...sendData,
      ...res,
    });
  };

  const onResultsRetry = () => {
    setResultsData(null);
  };
  const onResultsClose = () => {
    history.push(
      putParamsToUrl(ROUTES.FIO_WALLET, {
        publicKey,
        fioRequestTab: FIO_RECORD_TYPES.RECEIVED,
      }),
    );
  };

  const onBack = () => {
    history.push(
      putParamsToUrl(ROUTES.FIO_WALLET, { publicKey: fioWallet.publicKey }),
      {
        fioRecordDecrypted,
        fioRequestTab: FIO_RECORD_TYPES.RECEIVED,
      },
    );
  };

  const [walletFioAddresses] = useFioAddresses(
    fioWallet && fioWallet.publicKey,
  );
  const selectedAddress: FioAddressDoublet | null = fioRecordDecrypted
    ?.fioRecord?.to
    ? walletFioAddresses.find(
        ({ name }) => name === fioRecordDecrypted.fioRecord.to,
      ) || null
    : null;

  if (!publicKey || !fioRequestId) return <Redirect to={ROUTES.FIO_WALLETS} />;

  if (
    !location?.state?.fioWallet?.id ||
    !location?.state?.fioRecordDecrypted ||
    !(fioRequestId === fioRecordDecrypted.fioRecord?.id + '')
  )
    return (
      <Redirect
        to={{
          pathname: putParamsToUrl(ROUTES.FIO_WALLET, {
            publicKey,
          }),
        }}
      />
    );

  if (!walletFioAddresses?.length) return <FioLoader wrap={true} />;

  if (resultsData)
    return (
      <PaymentDetailsResults
        results={resultsData}
        title="Payment Details"
        onClose={onResultsClose}
        onRetry={onResultsRetry}
      />
    );

  return (
    <>
      {fioWallet.from === WALLET_CREATED_FROM.EDGE ? (
        <PaymentDetailsEdgeWallet
          fioWallet={fioWallet}
          onCancel={onCancel}
          onSuccess={onSuccess}
          sendData={sendData}
          processing={processing}
          setProcessing={setProcessing}
          contactsList={contactsList}
          createContact={createContact}
        />
      ) : null}

      <PseudoModalContainer
        title="Payment Details"
        onBack={onBack}
        middleWidth={true}
      >
        <InfoBadge
          type={BADGE_TYPES.INFO}
          show={true}
          title="FIO Chain"
          message={
            isFioChain(chainCode)
              ? 'Please use this form if you have already paid but the record has not been created.'
              : 'This request is not a FIO on chain request. You will need to complete the transaction outside of the dashboard and enter the transaction details below.'
          }
        />

        <PaymentDetailsForm
          fioWallet={fioWallet}
          initialValues={initialValues}
          loading={loading || processing}
          onSubmit={onSend}
          obtDataOn={true}
          senderFioAddress={selectedAddress}
        />
      </PseudoModalContainer>
    </>
  );
};

export default PaymentDetailsPage;
