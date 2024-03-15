import React, { useState, useEffect } from 'react';
import { useLocation, Redirect } from 'react-router-dom';

import PseudoModalContainer from '../../components/PseudoModalContainer';
import InfoBadge from '../../components/InfoBadge/InfoBadge';
import PaymentDetailsForm from './components/PaymentDetailsForm';
import PaymentDetailsEdgeWallet from './components/PaymentDetailsEdgeWallet';
import PaymentDetailsLedgerWallet from './components/PaymentDetailsLedgerWallet';
import PaymentDetailsResults from '../../components/common/TransactionResults/components/PaymentDetailsResults';
import FioLoader from '../../components/common/FioLoader/FioLoader';
import WalletAction from '../../components/WalletAction/WalletAction';
import PageTitle from '../../components/PageTitle/PageTitle';
import { PaymentDetailsMetemaskWallet } from './components/PaymentDetailsMetemaskWallet';

import { BADGE_TYPES } from '../../components/Badge/Badge';
import { ROUTES } from '../../constants/routes';
import { CONFIRM_PIN_ACTIONS } from '../../constants/common';
import { FIO_RECORD_TYPES } from '../WalletPage/constants';
import { LINKS } from '../../constants/labels';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';

import { useFioAddresses } from '../../util/hooks';
import { isFioChain } from '../../util/fio';

import { FioRecordViewDecrypted } from '../WalletPage/types';
import { FioAddressDoublet, FioWalletDoublet } from '../../types';
import {
  ContainerProps,
  PaymentDetailsResultValues,
  PaymentDetailsValues,
  PaymentDetailsInitialValues,
  TxValues,
  LocationProps,
} from './types';

const PaymentDetailsPage: React.FC<ContainerProps & LocationProps> = props => {
  const {
    history,
    contactsList,
    loading,
    createContact,
    getContactsList,
    refreshWalletDataPublicKey,
    location: { query: { publicKey, fioRequestId } = {} },
    feePrice,
    getFee,
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

  useEffect(() => {
    if (fioRecordDecrypted?.fioRecord?.from) {
      getFee(fioRecordDecrypted.fioRecord.from);
    }
  }, [fioRecordDecrypted, getFee]);

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
    history.push({
      pathname: ROUTES.FIO_WALLET,
      search: `${QUERY_PARAMS_NAMES.PUBLIC_KEY}=${publicKey}`,
      state: {
        fioRequestTab: FIO_RECORD_TYPES.RECEIVED,
      },
    });
  };

  const onBack = () => {
    history.push({
      pathname: ROUTES.FIO_WALLET,
      search: `${QUERY_PARAMS_NAMES.PUBLIC_KEY}=${fioWallet.publicKey}`,
      state: {
        fioRecordDecrypted,
        fioRequestTab: FIO_RECORD_TYPES.RECEIVED,
      },
    });
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
          pathname: ROUTES.FIO_WALLET,
          search: `${QUERY_PARAMS_NAMES.PUBLIC_KEY}=${publicKey}`,
        }}
      />
    );

  if (!walletFioAddresses?.length) return <FioLoader wrap={true} />;

  if (resultsData)
    return (
      <>
        <PageTitle link={LINKS.PAYMENT_DETAILS_CONFIRMATION} isVirtualPage />
        <PaymentDetailsResults
          results={resultsData}
          title="Payment Details"
          onClose={onResultsClose}
          onRetry={onResultsRetry}
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
        submitData={sendData}
        processing={processing}
        setProcessing={setProcessing}
        contactsList={contactsList}
        createContact={createContact}
        action={CONFIRM_PIN_ACTIONS.PAYMENT_DETAILS}
        FioActionWallet={PaymentDetailsEdgeWallet}
        MetamaskActionWallet={PaymentDetailsMetemaskWallet}
        LedgerActionWallet={PaymentDetailsLedgerWallet}
      />

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
              : 'This request is not a FIO on chain request. You will need to complete the transaction outside of the FIO App and enter the transaction details below.'
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
