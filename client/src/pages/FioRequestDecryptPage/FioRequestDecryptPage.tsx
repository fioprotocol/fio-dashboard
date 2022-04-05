import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import FioLoader from '../../components/common/FioLoader/FioLoader';
import PseudoModalContainer from '../../components/PseudoModalContainer';
import DecryptContentEdge from '../WalletPage/components/DecryptContentEdge';
import FioRequest from './components/FioRequest';
import SubmitButton from '../../components/common/SubmitButton/SubmitButton';
import InfoBadge from '../../components/InfoBadge/InfoBadge';

import { putParamsToUrl } from '../../utils';
import { transformFioRecord } from '../WalletPage/util';
import { isFioChain } from '../../util/fio';
import { useFioAddresses } from '../../util/hooks';

import { ROUTES } from '../../constants/routes';
import { WALLET_CREATED_FROM } from '../../constants/common';
import { FIO_RECORD_TYPES } from '../WalletPage/constants';
import { BADGE_TYPES } from '../../components/Badge/Badge';

import { ContainerProps } from './types';
import { FioDecryptedRecordData, FioRecord } from '../../types';

import classes from '../StakeTokensPage/styles/StakeTokensPage.module.scss';
import {
  FIO_REQUEST_STATUS_TYPES,
  FIO_REQUEST_STATUS_TYPES_TITLES,
} from '../../constants/fio';

const FioRequestDecryptPage: React.FC<ContainerProps> = (
  props: ContainerProps,
) => {
  const {
    fioWallet,
    fioWalletsData,
    history,
    match: {
      params: { publicKey, id },
    },
    refreshBalance,
  } = props;

  const fioRequestId = Number(id);
  const [submitData, setDecryptData] = useState<{
    itemData: FioRecord;
    paymentOtbData: FioRecord | null;
    fioRecordType: string;
  } | null>(null);
  const [initDecrypt, setInitDecrypt] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [fioRequest, setFioRequest] = useState<FioRecord | null>(null);
  const [fioRecordType, setFioRecordType] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);

  // todo: check if fio address from request is in wallet addresses
  const [, isWalletFioAddressesLoading] = useFioAddresses(
    fioWallet && fioWallet.publicKey,
  );

  useEffect(() => {
    setDecryptData(null);
  }, []);

  useEffect(() => {
    if (fioRequestId && fioWalletsData && publicKey && !fioRequest) {
      const { receivedFioRequests, sentFioRequests } = fioWalletsData[
        publicKey
      ];
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
    if (fioWallet && fioWallet.publicKey) refreshBalance(fioWallet.publicKey);
  }, [fioWallet]);

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
        paymentOtbData: null,
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
  ]);

  const onCancel = () => {
    setDecryptData(null);
    setProcessing(false);
  };
  const onSuccess = (fioRecordItemDecrypted: FioDecryptedRecordData) => {
    const { itemData } = fioRecordItemDecrypted;
    setProcessing(false);
    const fioRecordDecrypted = transformFioRecord({
      fioRecordItem: itemData,
      publicKey: fioWallet.publicKey,
      fioRecordType,
    });

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

  if (
    !fioWallet ||
    !fioWallet.id ||
    fioWallet.balance === null ||
    fioWalletsData === null ||
    fioRequest === null ||
    isWalletFioAddressesLoading
  )
    return (
      <div className="d-flex justify-content-center align-items-center w-100 flex-grow-1">
        <FioLoader />
      </div>
    );

  const onBack = () =>
    history.push(
      putParamsToUrl(ROUTES.FIO_WALLET, {
        publicKey: fioWallet.publicKey,
      }),
    );

  return (
    <>
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
        <p className={classes.subtitle}>
          <span className={classes.subtitleThin}>FIO Wallet Name:</span>{' '}
          {fioWallet.name}
        </p>

        <FioRequest
          fioRecordDetailedItem={null}
          fioRecordType={fioRecordType}
          fioRequest={fioRequest}
        />

        <InfoBadge
          message={error}
          show={!!error}
          title="Error"
          type={BADGE_TYPES.ERROR}
        />

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
      </PseudoModalContainer>
    </>
  );
};

export default FioRequestDecryptPage;
