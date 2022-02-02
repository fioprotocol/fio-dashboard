import React from 'react';

import EdgeConfirmAction from '../../../components/EdgeConfirmAction';

import { CONFIRM_PIN_ACTIONS } from '../../../constants/common';

import { SubmitActionParams } from '../../../components/EdgeConfirmAction/types';
import {
  FioWalletDoublet,
  FioRecord,
  FioDecryptedRecordData,
} from '../../../types';
import { decryptFioRequestData } from '../../../utils';
import { CONTENT_TYPES, FIO_RECORD_TYPES } from '../constants';
import { FIO_REQUEST_STATUS_TYPES } from '../../../constants/fio';

type Props = {
  submitData: {
    itemData: FioRecord;
    paymentOtbData: FioRecord | null;
  } | null;
  processing: boolean;
  fioWallet: FioWalletDoublet;
  setProcessing: (processing: boolean) => void;
  onSuccess: (data: FioDecryptedRecordData) => void;
  onCancel: () => void;
};

const processingProps = {
  title: 'Decrypting content',
  message: 'Hang tight while we are decrypting content',
};

const decryptContent = ({ data, keys }: SubmitActionParams) => {
  const { itemData, paymentOtbData, fioRecordType } = data;

  const contentType =
    fioRecordType === FIO_RECORD_TYPES.DATA
      ? CONTENT_TYPES.RECORD_OBT_DATA
      : CONTENT_TYPES.NEW_FUNDS;
  const decryptedContent = decryptFioRequestData({
    data: itemData,
    walletKeys: {
      public: keys.public,
      private: keys.private,
    },
    contentType,
  });

  let paymentData = null;
  if (itemData.status === FIO_REQUEST_STATUS_TYPES.PAID && paymentOtbData) {
    const paymentDecryptedContent = decryptFioRequestData({
      data: paymentOtbData,
      walletKeys: {
        public: keys.public,
        private: keys.private,
      },
      contentType: CONTENT_TYPES.RECORD_OBT_DATA,
    });

    paymentData = {
      fioRecord: paymentOtbData,
      fioDecryptedContent: {
        ...paymentDecryptedContent,
        txId: paymentDecryptedContent.obtId,
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
        txId: decryptedContent.obtId,
        chain: decryptedContent.chainCode,
        token: decryptedContent.tokenCode,
      },
    },
    paymentOtbData: paymentData,
  };
};

const DecryptContentEdge: React.FC<Props> = props => {
  const {
    onSuccess,
    onCancel,
    submitData,
    processing,
    setProcessing,
    fioWallet,
  } = props;

  return (
    <div>
      <EdgeConfirmAction
        onSuccess={onSuccess}
        onCancel={onCancel}
        submitAction={decryptContent}
        data={submitData}
        action={CONFIRM_PIN_ACTIONS.DETAILED_FIO_REQUEST}
        processing={processing}
        setProcessing={setProcessing}
        fioWalletEdgeId={fioWallet.edgeId || ''}
        processingProps={processingProps}
      />
    </div>
  );
};

export default DecryptContentEdge;
