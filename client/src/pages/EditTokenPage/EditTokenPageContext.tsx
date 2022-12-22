import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  currentFioAddress,
  fioWallets as fioWalletsSelector,
} from '../../redux/fio/selectors';

import { genericTokenId } from '../../util/fio';

import { usePublicAddresses } from '../../util/hooks';
import useQuery from '../../hooks/useQuery';
import { useGetMappedErrorRedirect } from '../../hooks/fio';

import { ELEMENTS_LIMIT_PER_BUNDLE_TRANSACTION } from '../../constants/fio';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';
import { CHAIN_CODES } from '../../constants/common';

import { LinkActionResult } from '../../types';
import {
  EditTokenElement,
  EditTokenContextProps,
  EditTokenValues,
} from './types';

export const useContext = (): EditTokenContextProps => {
  const queryParams = useQuery();
  const fioCryptoHandleName = queryParams.get(
    QUERY_PARAMS_NAMES.FIO_CRYPTO_HANDLE,
  );

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
  const [submitData, setSubmitData] = useState<EditTokenValues | null>(null);

  const {
    name: fioAddressName,
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
        publicAddresses
          .filter(pubAddress => pubAddress.chainCode !== CHAIN_CODES.SOCIALS)
          .map(pubAddress => ({
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

  const onSuccess = (result: LinkActionResult) => {
    setResultsData(result);
    setSubmitData(null);
    setProcessing(false);
  };

  const onCancel = () => {
    setSubmitData(null);
    setProcessing(false);
  };

  const onActionClick = () => {
    setSubmitData({
      pubAddressesArr,
      fioAddressName,
    });
  };

  const onBack = () => {
    setResultsData(null);
    changeBundleCost(0);
    pubAddressesToDefault();
  };

  const onRetry = () => {
    setSubmitData({
      pubAddressesArr,
      fioAddressName,
    });
  };
  return {
    bundleCost,
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
  };
};
