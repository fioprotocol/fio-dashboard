import { GenericAction, PublicAddress } from '@fioprotocol/fiosdk';
import { Fio as LedgerFioApp } from 'ledgerjs-hw-app-fio/dist/fio';
import { arrayToHex } from '@fioprotocol/fiojs/dist/chain-numeric';

import apis from '../';

import {
  transformPublicAddresses,
  normalizePublicAddresses,
  prepareChainTransaction,
} from '../../util/fio';
import { formatLedgerSignature, getPath } from '../../util/ledger';
import { log } from '../../util/general';

import {
  ELEMENTS_LIMIT_PER_BUNDLE_TRANSACTION,
  getEndPointByGenericAction,
} from '../../constants/fio';

import {
  FioWalletDoublet,
  LinkActionResult,
  PublicAddressDoublet,
  WalletKeys,
} from '../../types';

const linkTokens = async ({
  connectList,
  disconnectList,
  fioAddress,
  fee,
  disconnectAll,
  executeAction,
}: {
  connectList?: PublicAddressDoublet[];
  disconnectList?: PublicAddressDoublet[];
  fioAddress: string;
  fee?: number;
  disconnectAll?: boolean;
  executeAction: (
    action: GenericAction,
    params: {
      fioAddress: string;
      fee?: number;
      publicAddresses?: PublicAddress[];
    },
  ) => Promise<void>;
}): Promise<LinkActionResult> => {
  const updatePubAddresses = async (
    publicAddresses: PublicAddressDoublet[],
    action: GenericAction,
    oneBundleTransaction?: boolean,
  ) => {
    let updatedConnections: PublicAddressDoublet[] = [];
    let publicAddressesIteration: PublicAddressDoublet[] = [];

    const handleUpdatePubAddresses = async () => {
      const params: {
        fioAddress: string;
        fee?: number;
        publicAddresses?: PublicAddress[];
      } = {
        fioAddress,
        fee,
      };

      if (!disconnectAll) {
        params.publicAddresses = transformPublicAddresses(
          publicAddressesIteration,
        );
      }
      await executeAction(action, params);
    };

    for (const publicAddress of publicAddresses) {
      publicAddressesIteration.push(publicAddress);

      if (
        publicAddressesIteration.length ===
          ELEMENTS_LIMIT_PER_BUNDLE_TRANSACTION &&
        !oneBundleTransaction
      ) {
        try {
          await handleUpdatePubAddresses();
          updatedConnections = [
            ...updatedConnections,
            ...publicAddressesIteration,
          ];
          publicAddressesIteration = [];
        } catch (e) {
          return { updatedConnections, error: e };
        }
      }
    }

    if (publicAddressesIteration.length) {
      try {
        await handleUpdatePubAddresses();
        updatedConnections = [
          ...updatedConnections,
          ...publicAddressesIteration,
        ];
      } catch (e) {
        return { updatedConnections, error: e };
      }
    }

    return { updatedConnections };
  };

  try {
    const retResults: LinkActionResult = {
      connect: {
        updated: [],
        failed: [],
        error: null,
      },
      disconnect: {
        updated: [],
        failed: [],
        error: null,
      },
    };

    if (connectList) {
      const {
        updatedConnections,
        error: connectionError,
      }: {
        updatedConnections: PublicAddressDoublet[];
        error?: string | null;
      } = await updatePubAddresses(
        normalizePublicAddresses(connectList),
        GenericAction.addPublicAddresses,
      );

      const connectionsFailed: PublicAddressDoublet[] = [];

      for (const connectItem of connectList) {
        if (
          updatedConnections.findIndex(
            ({ publicAddress }) => publicAddress === connectItem.publicAddress,
          ) < 0
        ) {
          connectionsFailed.push(connectItem);
        }
      }

      retResults.connect.updated = updatedConnections;
      retResults.connect.failed = connectionsFailed;
      retResults.connect.error = connectionError;
    }

    if (disconnectList) {
      const {
        updatedConnections: updatedDisconnections,
        error: disconnectionError,
      }: {
        updatedConnections: PublicAddressDoublet[];
        error?: string | null;
      } = await updatePubAddresses(
        normalizePublicAddresses(disconnectList),
        disconnectAll
          ? GenericAction.removeAllPublicAddresses
          : GenericAction.removePublicAddresses,
        disconnectAll,
      );

      const disconnectionsFailed: PublicAddressDoublet[] = [];

      for (const disconnectItem of disconnectList) {
        if (
          updatedDisconnections.findIndex(
            ({ publicAddress }) =>
              publicAddress === disconnectItem.publicAddress,
          ) < 0
        ) {
          disconnectionsFailed.push(disconnectItem);
        }
      }

      retResults.disconnect.updated = updatedDisconnections;
      retResults.disconnect.failed = disconnectionsFailed;
      retResults.disconnect.error = disconnectionError;
    }

    return retResults;
  } catch (e) {
    log.error(e);
    throw e;
  }
};

export const linkTokensEdge = async ({
  connectList,
  disconnectList,
  fioAddress,
  fee,
  keys,
  disconnectAll,
}: {
  connectList?: PublicAddressDoublet[];
  disconnectList?: PublicAddressDoublet[];
  fioAddress: string;
  fee?: number;
  keys: WalletKeys;
  disconnectAll?: boolean;
}): Promise<LinkActionResult> => {
  const executeAction = async (
    action: GenericAction,
    params: {
      fioAddress: string;
      fee?: number;
      publicAddresses?: PublicAddress[];
    },
  ) => {
    await apis.fio.executeAction(keys, action, params);
  };

  return linkTokens({
    connectList,
    disconnectList,
    fioAddress,
    fee,
    disconnectAll,
    executeAction,
  });
};

export const linkTokensLedger = async ({
  connectList,
  disconnectList,
  fioAddress,
  fee,
  disconnectAll,
  appFio,
  fioWallet,
}: {
  connectList?: PublicAddressDoublet[];
  disconnectList?: PublicAddressDoublet[];
  fioAddress: string;
  fee?: number;
  disconnectAll?: boolean;
  appFio: LedgerFioApp;
  fioWallet: FioWalletDoublet;
}): Promise<LinkActionResult> => {
  const executeAction = async (
    action: GenericAction,
    params: {
      fioAddress: string;
      fee?: number;
      publicAddresses?: PublicAddress[];
    },
  ) => {
    const { chainId, transaction } = await prepareChainTransaction(
      fioWallet.publicKey,
      action,
      {
        fio_address: params.fioAddress,
        public_addresses: params.publicAddresses,
        max_fee: params.fee || 0,
        tpid: apis.fio.tpid,
      },
    );

    const {
      witness: { witnessSignatureHex },
    } = await appFio.signTransaction({
      path: getPath(fioWallet.data.derivationIndex),
      chainId,
      tx: transaction,
    });
    const signatureLedger = formatLedgerSignature(witnessSignatureHex);

    const {
      serializedTransaction,
      serializedContextFreeData,
    } = await apis.fio.publicFioSDK.transactions.serialize({
      chainId,
      transaction,
    });

    await apis.fio.publicFioSDK.executePreparedTrx(
      getEndPointByGenericAction(action),
      {
        compression: 0,
        packed_context_free_data: arrayToHex(
          serializedContextFreeData || new Uint8Array(0),
        ),
        packed_trx: arrayToHex(serializedTransaction),
        signatures: [signatureLedger],
      },
    );
  };

  return linkTokens({
    connectList,
    disconnectList,
    fioAddress,
    fee,
    disconnectAll,
    executeAction,
  });
};
