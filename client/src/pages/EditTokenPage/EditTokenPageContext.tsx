import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  currentFioAddress,
  fioWallets as fioWalletsSelector,
} from '../../redux/fio/selectors';

import { linkTokens } from '../../api/middleware/fio';
import { genericTokenId } from '../../util/fio';
import { minWaitTimeFunction } from '../../utils';
import { log } from '../../util/general';

import { usePublicAddresses } from '../../util/hooks';
import useQuery from '../../hooks/useQuery';
import { useGetMappedErrorRedirect } from '../../hooks/fio';

import {
  ELEMENTS_LIMIT_PER_BUNDLE_TRANSACTION,
  TOKEN_LINK_MIN_WAIT_TIME,
} from '../../constants/fio';
import { FCH_QUERY_PARAM_NAME } from '../../constants/queryParams';

import {
  LinkActionResult,
  PublicAddressDoublet,
  WalletKeys,
} from '../../types';
import { EditTokenElement } from './types';

export const useContext = () => {
  const queryParams = useQuery();
  const fioCryptoHandleName = queryParams.get(FCH_QUERY_PARAM_NAME);

  const fioCryptoHandleObj = useSelector(state =>
    currentFioAddress(state, fioCryptoHandleName),
  );

  usePublicAddresses(fioCryptoHandleName);
  useGetMappedErrorRedirect(fioCryptoHandleName);

  const fioWallets = useSelector(fioWalletsSelector);
  const [pubAddressesArr, changePubAddresses] = useState<EditTokenElement[]>(
    [],
  );
  const [bundleCost, changeBundleCost] = useState<number>(0);
  const [resultsData, setResultsData] = useState<LinkActionResult>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [submitData, setSubmitData] = useState<boolean | null>(null);

  const {
    edgeWalletId = '',
    remaining = 0,
    publicAddresses = [],
    walletPublicKey = '',
  } = fioCryptoHandleObj || {};

  const hasLowBalance = remaining - bundleCost < 0;
  const hasEdited = pubAddressesArr.some(
    pubAddress => pubAddress.newPublicAddress,
  );
  const fioWallet = fioWallets.find(
    ({ publicKey }) => publicKey === walletPublicKey,
  );

  const isDisabled = !hasEdited || hasLowBalance || remaining === 0;

  const pubAddressesToDefault = useCallback(() => {
    publicAddresses &&
      changePubAddresses(
        publicAddresses.map(pubAddress => ({
          ...pubAddress,
          isEditing: false,
          newPublicAddress: '',
          id: genericTokenId(
            pubAddress.chainCode,
            pubAddress.tokenCode,
            pubAddress.publicAddress,
          ),
        })),
      );
  }, [publicAddresses]);

  useEffect(() => {
    pubAddressesToDefault();
  }, [pubAddressesToDefault]);

  const handleEditTokenItem = (editedId: string, editedPubAddress: string) => {
    const currentAddress = pubAddressesArr.find(
      pubAddress => pubAddress.id === editedId,
    );
    if (!currentAddress) return;
    const { isEditing } = currentAddress;
    const updatePubAddressArr = () => {
      const updatedArr = pubAddressesArr.map(pubAddress =>
        pubAddress.id === editedId
          ? {
              ...pubAddress,
              newPublicAddress:
                editedPubAddress === pubAddress.publicAddress
                  ? ''
                  : editedPubAddress,
              isEditing: !isEditing,
            }
          : { ...pubAddress, isEditing: false },
      );
      const editedCount = updatedArr.filter(
        pubAddress => pubAddress.newPublicAddress || pubAddress.isEditing,
      ).length;

      changeBundleCost(
        Math.ceil(editedCount / ELEMENTS_LIMIT_PER_BUNDLE_TRANSACTION),
      );
      changePubAddresses(updatedArr);
    };
    updatePubAddressArr();
  };

  const onSuccess = () => {
    setProcessing(false);
  };

  const onCancel = () => {
    setSubmitData(null);
    setProcessing(false);
  };

  const submit = async ({ keys }: { keys: WalletKeys }) => {
    const editedPubAddresses = pubAddressesArr.filter(
      pubAddress => pubAddress.newPublicAddress,
    );
    const params: {
      fioAddress: string;
      connectList: PublicAddressDoublet[];
      keys: WalletKeys;
    } = {
      fioAddress: fioCryptoHandleName,
      connectList: editedPubAddresses.map(pubAddress => ({
        ...pubAddress,
        publicAddress: pubAddress.newPublicAddress,
      })),
      keys,
    };
    try {
      const actionResults = await minWaitTimeFunction(
        () => linkTokens(params),
        TOKEN_LINK_MIN_WAIT_TIME,
      );
      setResultsData({
        ...actionResults,
        disconnect: {
          ...actionResults.disconnect,
          updated: editedPubAddresses,
        },
      });
    } catch (err) {
      log.error(err);
    } finally {
      setSubmitData(null);
    }
  };

  const onActionClick = () => {
    setSubmitData(true);
  };

  const onBack = () => {
    setResultsData(null);
    changeBundleCost(0);
    pubAddressesToDefault();
  };

  const onRetry = () => {
    setSubmitData(true);
  };
  return {
    bundleCost,
    edgeWalletId,
    fioCryptoHandleObj,
    fioWallet,
    fioWallets,
    hasLowBalance,
    isDisabled,
    processing,
    pubAddressesArr,
    resultsData,
    submitData,
    changeBundleCost,
    handleEditTokenItem,
    onActionClick,
    onBack,
    onCancel,
    onRetry,
    onSuccess,
    setProcessing,
    submit,
  };
};
