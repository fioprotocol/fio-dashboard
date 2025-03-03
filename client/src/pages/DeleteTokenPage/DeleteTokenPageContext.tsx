import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  currentFioAddress,
  fioWallets as fioWalletsSelector,
  loading as loadingSelector,
} from '../../redux/fio/selectors';

import { genericTokenId } from '../../util/fio';
import MathOp from '../../util/math';

import { usePublicAddresses } from '../../util/hooks';
import useQuery from '../../hooks/useQuery';
import { useGetMappedErrorRedirect } from '../../hooks/fio';

import { ELEMENTS_LIMIT_PER_BUNDLE_TRANSACTION } from '../../constants/fio';

import { CHAIN_CODES } from '../../constants/common';
import { BUNDLES_TX_COUNT } from '../../constants/fio';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';

import {
  CheckedTokenType,
  DeleteTokenContextProps,
  DeleteTokenValues,
} from './types';
import { LinkActionResult } from '../../types';

export const useContext = (): DeleteTokenContextProps => {
  const queryParams = useQuery();
  const fioCryptoHandleName = queryParams.get(QUERY_PARAMS_NAMES.FIO_HANDLE);

  const fioCryptoHandleObj = useSelector(state =>
    currentFioAddress(state, fioCryptoHandleName),
  );

  usePublicAddresses(fioCryptoHandleName);
  useGetMappedErrorRedirect(fioCryptoHandleName);

  const fioWallets = useSelector(fioWalletsSelector);
  const loading = useSelector(loadingSelector);

  const [pubAddressesArr, changePubAddresses] = useState<CheckedTokenType[]>(
    [],
  );
  const [bundleCost, changeBundleCost] = useState<number>(0);
  const [allChecked, toggleAllChecked] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const [submitData, setSubmitData] = useState<DeleteTokenValues | null>(null);
  const [resultsData, setResultsData] = useState<LinkActionResult>(null);

  const { remaining = 0, publicAddresses = [], walletPublicKey = '' } =
    fioCryptoHandleObj || {};

  const hasLowBalance = remaining - bundleCost < 0 || remaining === 0;

  const hasChecked = pubAddressesArr.some(pubAddress => pubAddress.isChecked);

  const checkedPubAddresses = pubAddressesArr.filter(pubAddress => {
    const { isChecked, chainCode, tokenCode } = pubAddress;
    const isFioToken =
      chainCode === CHAIN_CODES.FIO && tokenCode === CHAIN_CODES.FIO;
    return isChecked && !isFioToken;
  });

  const hasSocialMediaLinks = publicAddresses.some(
    publicAddress => publicAddress.chainCode === CHAIN_CODES.SOCIALS,
  );

  const allowDisconnectAll = allChecked && !hasSocialMediaLinks;

  const fioWallet = fioWallets.find(
    ({ publicKey }) => publicKey === walletPublicKey,
  );

  const isDisabled = !hasChecked || remaining === 0;

  const pubAddressesToDefault = useCallback(
    () =>
      publicAddresses &&
      changePubAddresses(
        publicAddresses
          .filter(pubAddress => pubAddress.chainCode !== CHAIN_CODES.SOCIALS)
          .map(pubAddress => ({
            ...pubAddress,
            isChecked: false,
            id: genericTokenId(
              pubAddress.chainCode,
              pubAddress.tokenCode,
              pubAddress.publicAddress,
            ),
          })),
      ),
    [publicAddresses],
  );

  useEffect(() => {
    pubAddressesToDefault();
  }, [pubAddressesToDefault]);

  useEffect(() => {
    if (allowDisconnectAll) {
      return changeBundleCost(BUNDLES_TX_COUNT.REMOVE_PUBLIC_ADDRESS);
    }

    if (hasChecked) {
      return changeBundleCost(
        new MathOp(checkedPubAddresses.length)
          .div(ELEMENTS_LIMIT_PER_BUNDLE_TRANSACTION)
          .round(0, 3)
          .toNumber(),
      );
    }

    if (resultsData?.disconnect?.updated) {
      if (allowDisconnectAll) {
        return changeBundleCost(BUNDLES_TX_COUNT.REMOVE_PUBLIC_ADDRESS);
      }
      return changeBundleCost(
        new MathOp(resultsData.disconnect.updated.length)
          .div(ELEMENTS_LIMIT_PER_BUNDLE_TRANSACTION)
          .round(0, 3)
          .toNumber(),
      );
    }
    return changeBundleCost(0);
  }, [
    allowDisconnectAll,
    checkedPubAddresses.length,
    hasChecked,
    resultsData?.disconnect?.updated,
  ]);

  useEffect(() => {
    toggleAllChecked(pubAddressesArr.every(pubAddress => pubAddress.isChecked));
  }, [pubAddressesArr]);

  const onCheckClick = (checkedId: string) => {
    changePubAddresses(
      pubAddressesArr.map(pubAddress =>
        pubAddress.id === checkedId
          ? {
              ...pubAddress,
              isChecked: !pubAddress.isChecked,
            }
          : pubAddress,
      ),
    );
  };

  const allCheckedChange = (isChecked: boolean) => {
    toggleAllChecked(isChecked);
    changePubAddresses(
      pubAddressesArr.map(pubAddress => ({
        ...pubAddress,
        isChecked,
      })),
    );
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
      fioCryptoHandle: fioCryptoHandleObj,
      allChecked,
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
      fioCryptoHandle: fioCryptoHandleObj,
      allChecked,
    });
  };

  return {
    allChecked,
    allowDisconnectAll,
    bundleCost,
    checkedPubAddresses,
    fioCryptoHandleObj,
    fioWallet,
    fioWallets,
    hasChecked,
    hasLowBalance,
    isDisabled,
    loading,
    processing,
    pubAddressesArr,
    resultsData,
    submitData,
    allCheckedChange,
    changeBundleCost,
    onActionClick,
    onBack,
    onCancel,
    onCheckClick,
    onRetry,
    onSuccess,
    setProcessing,
  };
};
