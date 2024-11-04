import React from 'react';

import { GenericAction } from '@fioprotocol/fiosdk';

import EdgeConfirmAction from '../../../components/EdgeConfirmAction';

import apis from '../../../api';

import { linkTokensEdge } from '../../../api/middleware/fio';
import { log } from '../../../util/general';

import { CONFIRM_PIN_ACTIONS } from '../../../constants/common';
import { BUNDLES_TX_COUNT, FIO_CHAIN_CODE } from '../../../constants/fio';

import { FioWalletDoublet } from '../../../types';
import { RequestTokensValues } from '../types';
import { SubmitActionParams } from '../../../components/EdgeConfirmAction/types';
import { TrxResponsePaidBundles } from '../../../api/fio';

type Props = {
  fioWallet: FioWalletDoublet;
  onSuccess: (data: TrxResponsePaidBundles) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  submitData: RequestTokensValues | null;
  processing: boolean;
  createContact: (name: string) => void;
  contactsList: string[];
};

type RequestProps = {
  payerFioAddress: string;
  payeeFioAddress: string;
  payeeTokenPublicAddress: string;
  amount: number;
  chainCode: string;
  tokenCode: string;
  memo: string;
  payerFioPublicKey?: string;
  hash?: string;
  offlineUrl?: string;
};

const RequestTokensEdgeWallet: React.FC<Props> = props => {
  const {
    fioWallet,
    setProcessing,
    onSuccess,
    onCancel,
    submitData: requestData,
    processing,
    createContact,
    contactsList,
  } = props;

  const send = async ({ keys, data }: SubmitActionParams) => {
    const params: RequestProps = {
      ...data,
      amount: Number(data.amount),
    };

    const result = await apis.fio.executeAction(
      keys,
      GenericAction.requestFunds,
      params,
    );
    let mapError;
    let bundlesCollected = BUNDLES_TX_COUNT.NEW_FIO_REQUEST;

    if (data.mapPubAddress && data.chainCode !== FIO_CHAIN_CODE) {
      try {
        await linkTokensEdge({
          connectList: [
            {
              publicAddress: data.payeeTokenPublicAddress,
              chainCode: data.chainCode,
              tokenCode: data.tokenCode,
            },
          ],
          keys,
          fioAddress: data.payeeFioAddress,
        });
        bundlesCollected += BUNDLES_TX_COUNT.ADD_PUBLIC_ADDRESS;
      } catch (e) {
        log.error(e);
        mapError = e;
      }
    }

    if (!contactsList?.filter(c => c === params.payerFioAddress).length)
      createContact && createContact(params.payerFioAddress);

    return {
      ...result,
      bundlesCollected,
      mapError,
      mapPubAddress: data.mapPubAddress,
    };
  };

  return (
    <EdgeConfirmAction
      action={CONFIRM_PIN_ACTIONS.REQUEST}
      setProcessing={setProcessing}
      onSuccess={onSuccess}
      onCancel={onCancel}
      processing={processing}
      data={requestData}
      submitAction={send}
      fioWalletEdgeId={fioWallet.edgeId || ''}
      edgeAccountLogoutBefore={true}
    />
  );
};

export default RequestTokensEdgeWallet;
