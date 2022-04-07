import { PublicAddress } from '@fioprotocol/fiosdk/src/entities/PublicAddress';

import apis from '../';

import {
  transformPublicAddresses,
  normalizePublicAddresses,
} from '../../util/fio';
import { log } from '../../util/general';

import {
  ACTIONS,
  ELEMENTS_LIMIT_PER_BUNDLE_TRANSACTION,
} from '../../constants/fio';

import {
  LinkActionResult,
  PublicAddressDoublet,
  WalletKeys,
} from '../../types';

export const linkTokens = async ({
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
  const updatePubAddresses = async (
    publicAddresses: PublicAddressDoublet[],
    action: string,
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
      await apis.fio.executeAction(keys, action, params);
    };

    for (const publicAddress of publicAddresses) {
      publicAddressesIteration.push(publicAddress);

      if (
        publicAddressesIteration.length ===
          ELEMENTS_LIMIT_PER_BUNDLE_TRANSACTION &&
        !oneBundleTransaction
      ) {
        try {
          handleUpdatePubAddresses();
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
        handleUpdatePubAddresses();
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
        ACTIONS.addPublicAddresses,
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
          ? ACTIONS.removeAllPublicAddresses
          : ACTIONS.removePublicAddresses,
        true,
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
