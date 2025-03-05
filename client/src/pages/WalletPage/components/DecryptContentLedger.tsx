import React from 'react';
import { Fio as LedgerFioApp } from 'ledgerjs-hw-app-fio/dist/fio';
import { Ecc, Serialize } from '@fioprotocol/fiojs';
import { deserialize } from '@fioprotocol/fiojs/dist/encryption-fio';

import { Action, ContentType, FioRequestStatus } from '@fioprotocol/fiosdk';

import LedgerConnect from '../../../components/LedgerConnect';

import { CONFIRM_LEDGER_ACTIONS } from '../../../constants/common';
import { FIO_RECORD_TYPES } from '../constants';

import { getPath } from '../../../util/ledger';
import { camelizeObjKeys } from '../../../utils';

import { FioRecord, FioWalletDoublet } from '../../../types';
import { TrxResponsePaidBundles } from '../../../api/fio';

type Props = {
  fioWallet: FioWalletDoublet;
  onSuccess: (data: TrxResponsePaidBundles) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  submitData: {
    itemData: FioRecord;
    paymentOtbData: FioRecord | null;
    fioRecordType: string;
  } | null;
  processing: boolean;
  fee: string;
};

const RequestTokensLedgerWallet: React.FC<Props> = props => {
  const {
    fee,
    fioWallet,
    setProcessing,
    onSuccess,
    onCancel,
    submitData,
    processing,
  } = props;

  const submit = async (appFio: LedgerFioApp) => {
    const { itemData, fioRecordType, paymentOtbData } = submitData;
    const contentType =
      fioRecordType === FIO_RECORD_TYPES.DATA
        ? ContentType.recordObtDataContent
        : ContentType.newFundsContent;
    const context =
      fioRecordType === FIO_RECORD_TYPES.DATA
        ? Action.recordObt
        : Action.newFundsRequest;
    const decodedMessage = await appFio.decodeMessage({
      path: getPath(fioWallet.data.derivationIndex),
      publicKeyHex: Ecc.PublicKey(
        itemData.payerFioPublicKey === fioWallet.publicKey
          ? itemData.payeeFioPublicKey
          : itemData.payerFioPublicKey,
      )
        .toUncompressed()
        .toBuffer()
        .toString('hex'),
      message: itemData.content,
      context,
    });
    const decryptedContent = camelizeObjKeys(
      deserialize(
        new Serialize.SerialBuffer({ array: decodedMessage.message }),
        contentType,
      ),
    );

    let paymentData = null;
    if (
      itemData.status === FioRequestStatus.sentToBlockchain &&
      paymentOtbData
    ) {
      const paymentDecodedMessage = await appFio.decodeMessage({
        path: getPath(fioWallet.data.derivationIndex),
        publicKeyHex: Ecc.PublicKey(
          paymentOtbData.payerFioPublicKey === fioWallet.publicKey
            ? paymentOtbData.payeeFioPublicKey
            : paymentOtbData.payerFioPublicKey,
        )
          .toUncompressed()
          .toBuffer()
          .toString('hex'),
        message: paymentOtbData.content,
        context: Action.recordObt,
      });
      const paymentDecryptedContent = camelizeObjKeys(
        deserialize(
          new Serialize.SerialBuffer({ array: paymentDecodedMessage.message }),
          ContentType.recordObtDataContent,
        ),
      );

      paymentData = {
        fioRecord: paymentOtbData,
        fioDecryptedContent: {
          ...paymentDecryptedContent,
          obtId: paymentDecryptedContent.obtId,
          chain: paymentDecryptedContent.chainCode,
          token: paymentDecryptedContent.tokenCode,
        },
      };
    }

    return {
      itemData: {
        fioRecord: itemData,
        fioDecryptedContent: {
          ...decryptedContent,
          obtId: decryptedContent.obtId,
          chain: decryptedContent.chainCode,
          token: decryptedContent.tokenCode,
        },
      },
      paymentOtbData: paymentData,
    };
  };

  if (!submitData) return null;

  return (
    <LedgerConnect
      action={CONFIRM_LEDGER_ACTIONS.DETAILED_FIO_REQUEST}
      data={submitData}
      fee={fee}
      fioWallet={fioWallet}
      onConnect={submit}
      onSuccess={onSuccess}
      onCancel={onCancel}
      setProcessing={setProcessing}
      isTransaction={processing}
    />
  );
};

export default RequestTokensLedgerWallet;
