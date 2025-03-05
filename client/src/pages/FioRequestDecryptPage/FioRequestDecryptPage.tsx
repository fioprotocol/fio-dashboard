import React, { useCallback, useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import { FioRequestStatus } from '@fioprotocol/fiosdk';

import FioLoader from '../../components/common/FioLoader/FioLoader';
import PseudoModalContainer from '../../components/PseudoModalContainer';
import DecryptContentEdge from '../WalletPage/components/DecryptContentEdge';
import DecryptContentLedger from '../WalletPage/components/DecryptContentLedger';
import FioRequest from './components/FioRequest';
import SubmitButton from '../../components/common/SubmitButton/SubmitButton';
import InfoBadge from '../../components/InfoBadge/InfoBadge';
import FioRequestStatusBadge from '../../components/Badges/FioRequestStatusBadge/FioRequestStatusBadge';
import WalletAction from '../../components/WalletAction/WalletAction';
import FioNamesInitWrapper from '../../components/FioNamesInitWrapper';
import { DecryptContentMetamaskWallet } from '../WalletPage/components/DecryptContentMetamaskWallet';

import { transformFioRecord } from '../WalletPage/util';
import { isFioChain } from '../../util/fio';
import apis from '../../api';
import { log } from '../../util/general';
import useEffectOnce from '../../hooks/general';

import { ROUTES } from '../../constants/routes';
import { CONFIRM_PIN_ACTIONS } from '../../constants/common';
import { FIO_RECORD_TYPES } from '../WalletPage/constants';
import { BADGE_TYPES } from '../../components/Badge/Badge';
import { FIO_REQUEST_STATUS_TYPES_TITLES } from '../../constants/fio';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';

import { emptyWallet } from '../../redux/fio/reducer';

import {
  ContainerProps,
  LocationProps,
  FioRequestDecryptValues,
} from './types';
import {
  FioDecryptedRecordData,
  FioRecord,
  FioWalletDoublet,
} from '../../types';
import { FioRecordViewDecrypted } from '../WalletPage/types';

import detailsModalClasses from '../WalletPage/styles/FioRecordDetailedModal.module.scss';
import classes from '../WalletPage/styles/WalletPage.module.scss';

const FioRequestDecryptPage: React.FC<ContainerProps &
  LocationProps> = props => {
  const {
    fioWallets,
    history,
    location: { query: { publicKey, fioRequestId: id } = {} },
    refreshBalance,
    refreshWalletDataPublicKey,
    setConfirmPinKeys,
  } = props;

  const fioWallet =
    fioWallets.find(
      (walletItem: FioWalletDoublet) => publicKey === walletItem.publicKey,
    ) || emptyWallet;
  const fioRequestId = Number(id);
  const [submitData, setDecryptData] = useState<FioRequestDecryptValues | null>(
    null,
  );
  const [initDecrypt, setInitDecrypt] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [fioRequest, setFioRequest] = useState<FioRecord | null>(null);
  const [paymentOtbData, setPaymentData] = useState<FioRecord | null>(null);
  const [
    fioRequestDecrypted,
    setFioRequestDecrypted,
  ] = useState<FioRecordViewDecrypted | null>(null);
  const [
    fioPaymentDataDecrypted,
    setPaymentDataDecrypted,
  ] = useState<FioRecordViewDecrypted | null>(null);
  const [fioRecordType, setFioRecordType] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);

  const [receivedFioRequests, setReceivedFioRequests] = useState<FioRecord[]>(
    [],
  );

  const [sentFioRequests, setSentFioRequests] = useState<FioRecord[]>([]);
  const [obtData, setObtData] = useState<FioRecord[]>([]);
  const [sentFioRequestsLoading, toggleSentFioRequestsLoading] = useState<
    boolean
  >(false);
  const [
    receivedFioRequestsLoading,
    toggleReceivedFioRequestsLoading,
  ] = useState<boolean>(false);
  const [obtDataLoading, toggleObtDataLoading] = useState<boolean>(false);

  const [sentFioRequestsStarted, setSentFioRequestsStarted] = useState<boolean>(
    false,
  );
  const [receivedFioRequestsStarted, setReceivedFioRequestsStarted] = useState<
    boolean
  >(false);
  const [obtDataStarted, setObtDataStarted] = useState<boolean>(false);

  const getReceivedFioRequests = useCallback(async () => {
    try {
      toggleReceivedFioRequestsLoading(true);
      setReceivedFioRequestsStarted(true);

      const receivedFioRequests = await apis.fio.getReceivedFioRequests(
        publicKey,
      );

      setReceivedFioRequests(receivedFioRequests);
    } catch (err) {
      log.error(err);
    } finally {
      toggleReceivedFioRequestsLoading(false);
    }
  }, [publicKey]);

  const getSentFioRequests = useCallback(async () => {
    try {
      toggleSentFioRequestsLoading(true);
      setSentFioRequestsStarted(true);
      const sentFioRequests = await apis.fio.getSentFioRequests(publicKey);
      setSentFioRequests(sentFioRequests);
    } catch (err) {
      log.error(err);
    } finally {
      toggleSentFioRequestsLoading(false);
    }
  }, [publicKey]);

  const getObtData = useCallback(async () => {
    try {
      toggleObtDataLoading(true);
      setObtDataStarted(true);
      const obtData = await apis.fio.getObtData(publicKey);
      setObtData(obtData);
    } catch (err) {
      log.error(err);
    } finally {
      toggleObtDataLoading(false);
    }
  }, [publicKey]);

  const getFioRequests = useCallback(() => {
    getReceivedFioRequests();
    getSentFioRequests();
    getObtData();
  }, [getReceivedFioRequests, getSentFioRequests, getObtData]);

  // todo: check if fio address from request is in wallet addresses

  useEffect(() => {
    setDecryptData(null);
    return () => setConfirmPinKeys(null);
  }, [setDecryptData, setConfirmPinKeys]);

  useEffect(() => {
    if (
      fioRequestId &&
      publicKey &&
      !sentFioRequestsLoading &&
      !receivedFioRequestsLoading &&
      !obtDataLoading &&
      sentFioRequestsStarted &&
      receivedFioRequestsStarted &&
      obtDataStarted
    ) {
      const receivedRequest = receivedFioRequests?.find(
        (item: FioRecord) => item.fioRequestId === fioRequestId,
      );
      if (receivedRequest) {
        setFioRequest(receivedRequest);
        setFioRecordType(FIO_RECORD_TYPES.RECEIVED);
        if (receivedRequest.status !== FioRequestStatus.requested) {
          setError(
            `Your request is ${
              FIO_REQUEST_STATUS_TYPES_TITLES[receivedRequest.status]
            }`,
          );
        }
        return;
      }
      const sentRequest = sentFioRequests?.find(
        (item: FioRecord) => item.fioRequestId === fioRequestId,
      );
      if (sentRequest) {
        if (sentRequest.status === FioRequestStatus.sentToBlockchain) {
          setPaymentData(
            obtData.find(
              (item: FioRecord) => item.fioRequestId === fioRequestId,
            ),
          );
        }
        setFioRequest(sentRequest);
        setFioRecordType(FIO_RECORD_TYPES.SENT);
        return;
      }

      setFioRequest(
        receivedRequest ||
          sentRequest || {
            fioRequestId: 1,
            payerFioAddress: '',
            payeeFioAddress: '',
            content: '',
            payeeFioPublicKey: '',
            payerFioPublicKey: '',
            status: '',
            timeStamp: '',
          },
      );
      setError(
        `We could not find your FIO request (${fioRequestId}). FIO Handle or wallet is not available.`,
      );
    }
  }, [
    fioRequestId,
    obtData,
    obtDataLoading,
    obtDataStarted,
    publicKey,
    receivedFioRequests,
    receivedFioRequestsLoading,
    receivedFioRequestsStarted,
    sentFioRequests,
    sentFioRequestsLoading,
    sentFioRequestsStarted,
  ]);

  useEffect(() => {
    if (fioWallet && fioWallet.publicKey) {
      refreshBalance(fioWallet.publicKey);
      refreshWalletDataPublicKey(fioWallet.publicKey);
    } else {
      setError(`You don't have a wallet with such public key - ${publicKey}`);
    }
  }, [publicKey, fioWallet, refreshBalance, refreshWalletDataPublicKey]);

  useEffect(() => {
    if (
      fioRequestId &&
      fioRecordType &&
      fioRequest &&
      fioWallet &&
      !initDecrypt &&
      !submitData
    ) {
      setInitDecrypt(true);
      setDecryptData({
        itemData: fioRequest,
        paymentOtbData,
        fioRecordType,
      });
    }
  }, [
    fioWallet,
    fioRequestId,
    fioRequest,
    fioRecordType,
    submitData,
    initDecrypt,
    paymentOtbData,
  ]);

  useEffectOnce(() => {
    getFioRequests();
  }, [getFioRequests]);

  const onCancel = () => {
    setDecryptData(null);
    setProcessing(false);
  };
  const onSuccess = (fioRecordItemDecrypted: FioDecryptedRecordData) => {
    const {
      itemData,
      paymentOtbData: decryptedPaymentData,
    } = fioRecordItemDecrypted;
    setProcessing(false);
    const fioRecordDecrypted = transformFioRecord({
      fioRecordItem: itemData,
      publicKey: fioWallet.publicKey,
      fioRecordType,
    });

    if (fioRecordType === FIO_RECORD_TYPES.SENT) {
      setFioRequestDecrypted(fioRecordDecrypted);
      !!decryptedPaymentData &&
        setPaymentDataDecrypted(
          transformFioRecord({
            fioRecordItem: decryptedPaymentData,
            publicKey: fioWallet.publicKey,
            fioRecordType,
          }),
        );
      setDecryptData(null);
      return;
    }

    if (isFioChain(fioRecordDecrypted.fioDecryptedContent.chainCode)) {
      history.push({
        pathname: ROUTES.SEND,
        search: `${QUERY_PARAMS_NAMES.PUBLIC_KEY}=${fioWallet.publicKey}`,
        state: {
          fioWallet,
          fioRecordDecrypted,
        },
      });
    } else {
      history.push({
        pathname: ROUTES.PAYMENT_DETAILS,
        search: `${QUERY_PARAMS_NAMES.PUBLIC_KEY}=${fioWallet.publicKey}&${QUERY_PARAMS_NAMES.FIO_REQUEST_ID}=${fioRecordDecrypted.fioRecord.id}`,
        state: {
          fioWallet,
          fioRecordDecrypted,
        },
      });
    }
  };

  if (!publicKey || !fioRequestId)
    return <Redirect to={{ pathname: ROUTES.TOKENS }} />;

  if (error)
    return (
      <div className={classes.container}>
        <PseudoModalContainer
          title="FIO Request"
          onBack={null}
          middleWidth={true}
        >
          <InfoBadge
            message={error}
            show={!!error}
            title="Error"
            type={BADGE_TYPES.ERROR}
          />
        </PseudoModalContainer>
      </div>
    );

  if (
    !fioWallet ||
    !fioWallet.id ||
    fioRequest === null ||
    sentFioRequestsLoading ||
    receivedFioRequestsLoading ||
    obtDataLoading
  )
    return <FioLoader wrap={true} />;

  const onBack = () =>
    history.push({
      pathname: ROUTES.FIO_WALLET,
      search: `${QUERY_PARAMS_NAMES.PUBLIC_KEY}=${fioWallet.publicKey}`,
    });

  return (
    <div className={classes.container}>
      <WalletAction
        fioWallet={fioWallet}
        action={CONFIRM_PIN_ACTIONS.DETAILED_FIO_REQUEST}
        submitData={submitData}
        processing={processing}
        setProcessing={setProcessing}
        onCancel={onCancel}
        onSuccess={onSuccess}
        FioActionWallet={DecryptContentEdge}
        MetamaskActionWallet={DecryptContentMetamaskWallet}
        LedgerActionWallet={DecryptContentLedger}
      />

      <PseudoModalContainer
        title="FIO Request"
        onBack={onBack || null}
        middleWidth={true}
      >
        <div className={detailsModalClasses.statusBadgeRight}>
          <FioRequestStatusBadge status={fioRequest.status} />
        </div>
        <p className={classes.subtitle}>
          <span className={classes.subtitleThin}>FIO Wallet Name:</span>{' '}
          {fioWallet.name}
        </p>

        <FioRequest
          fioRecordDecrypted={fioRequestDecrypted}
          fioRecordPaymentDataDecrypted={fioPaymentDataDecrypted}
          fioRecordType={fioRecordType}
          fioRequest={fioRequest}
          fioWallet={fioWallet}
        />

        {!fioRequestDecrypted ? (
          <div className="d-flex justify-content-center mt-4">
            <SubmitButton
              text="Decrypt"
              withTopMargin={true}
              disabled={!!error}
              onClick={() =>
                setDecryptData({
                  itemData: fioRequest,
                  paymentOtbData: null,
                  fioRecordType,
                })
              }
            />
          </div>
        ) : null}
      </PseudoModalContainer>
    </div>
  );
};

const FioRequestDecryptPageWrapper: React.FC<ContainerProps> = props => (
  <FioNamesInitWrapper>
    <FioRequestDecryptPage {...props} />
  </FioNamesInitWrapper>
);

export default FioRequestDecryptPageWrapper;
