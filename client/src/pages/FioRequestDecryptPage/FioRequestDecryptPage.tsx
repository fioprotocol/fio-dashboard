import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import FioLoader from '../../components/common/FioLoader/FioLoader';
import PseudoModalContainer from '../../components/PseudoModalContainer';
import DecryptContentEdge from '../WalletPage/components/DecryptContentEdge';
import FioRequest from './components/FioRequest';
import SubmitButton from '../../components/common/SubmitButton/SubmitButton';
import InfoBadge from '../../components/InfoBadge/InfoBadge';
import FioRequestStatusBadge from '../../components/Badges/FioRequestStatusBadge/FioRequestStatusBadge';
import FioNamesInitWrapper from '../../components/FioNamesInitWrapper';

import { putParamsToUrl } from '../../utils';
import { transformFioRecord } from '../WalletPage/util';
import { isFioChain } from '../../util/fio';

import { ROUTES } from '../../constants/routes';
import { WALLET_CREATED_FROM } from '../../constants/common';
import { FIO_RECORD_TYPES } from '../WalletPage/constants';
import { BADGE_TYPES } from '../../components/Badge/Badge';
import {
  FIO_REQUEST_STATUS_TYPES,
  FIO_REQUEST_STATUS_TYPES_TITLES,
} from '../../constants/fio';
import { emptyWallet } from '../../redux/fio/reducer';

import { ContainerProps } from './types';
import {
  FioDecryptedRecordData,
  FioRecord,
  FioWalletDoublet,
} from '../../types';
import { FioRecordViewDecrypted } from '../WalletPage/types';

import detailsModalClasses from '../WalletPage/styles/FioRecordDetailedModal.module.scss';
import classes from '../WalletPage/styles/WalletPage.module.scss';

const FioRequestDecryptPage: React.FC<ContainerProps> = props => {
  const {
    fioWallets,
    fioWalletsData,
    history,
    match: {
      params: { publicKey, id },
    },
    refreshBalance,
    refreshWalletDataPublicKey,
    setConfirmPinKeys,
  } = props;

  const fioWallet =
    fioWallets.find(
      (walletItem: FioWalletDoublet) => publicKey === walletItem.publicKey,
    ) || emptyWallet;
  const fioRequestId = Number(id);
  const [submitData, setDecryptData] = useState<{
    itemData: FioRecord;
    paymentOtbData: FioRecord | null;
    fioRecordType: string;
  } | null>(null);
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

  // todo: check if fio address from request is in wallet addresses

  useEffect(() => {
    setDecryptData(null);
    return () => setConfirmPinKeys(null);
  }, [setDecryptData, setConfirmPinKeys]);

  useEffect(() => {
    if (fioRequestId && fioWalletsData && publicKey && !fioRequest) {
      const { receivedFioRequests = [], sentFioRequests = [], obtData = [] } =
        fioWalletsData[publicKey] || {};
      const receivedRequest = receivedFioRequests.find(
        (item: FioRecord) => item.fioRequestId === fioRequestId,
      );
      if (receivedRequest) {
        setFioRequest(receivedRequest);
        setFioRecordType(FIO_RECORD_TYPES.RECEIVED);
        if (receivedRequest.status !== FIO_REQUEST_STATUS_TYPES.PENDING) {
          setError(
            `Your request is ${
              FIO_REQUEST_STATUS_TYPES_TITLES[receivedRequest.status]
            }`,
          );
        }
        return;
      }
      const sentRequest = sentFioRequests.find(
        (item: FioRecord) => item.fioRequestId === fioRequestId,
      );
      if (sentRequest) {
        if (sentRequest.status === FIO_REQUEST_STATUS_TYPES.PAID) {
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
        `We could not find your fio request (${fioRequestId}). Fio crypto handle or wallet is not available.`,
      );
    }
  }, [fioWalletsData, fioRequest, fioRequestId, publicKey]);

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
      history.push(
        putParamsToUrl(ROUTES.SEND, {
          publicKey: fioWallet.publicKey,
        }),
        {
          fioWallet,
          fioRecordDecrypted,
        },
      );
    } else {
      history.push(
        putParamsToUrl(ROUTES.PAYMENT_DETAILS, {
          publicKey: fioWallet.publicKey,
          fioRequestId: fioRecordDecrypted.fioRecord.id + '',
        }),
        {
          fioWallet,
          fioRecordDecrypted,
        },
      );
    }
  };

  if (!publicKey || !fioRequestId)
    return <Redirect to={{ pathname: ROUTES.TOKENS }} />;

  if (error)
    return (
      <div className={classes.container}>
        <PseudoModalContainer
          title="Fio Request"
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
    fioWalletsData === null ||
    fioRequest === null
  )
    return <FioLoader wrap={true} />;

  const onBack = () =>
    history.push(
      putParamsToUrl(ROUTES.FIO_WALLET, {
        publicKey: fioWallet.publicKey,
      }),
    );

  return (
    <div className={classes.container}>
      {fioWallet.from === WALLET_CREATED_FROM.EDGE ? (
        <DecryptContentEdge
          fioWallet={fioWallet}
          onCancel={onCancel}
          onSuccess={onSuccess}
          submitData={submitData}
          processing={processing}
          setProcessing={setProcessing}
        />
      ) : null}

      <PseudoModalContainer
        title="Fio Request"
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
