import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  currentFioAddress,
  fioWallets as fioWalletsSelector,
  loading as loadingSelector,
} from '../../redux/fio/selectors';

import { linkTokens } from '../../api/middleware/fio';
import { genericTokenId } from '../../util/fio';
import { minWaitTimeFunction } from '../../utils';
import { log } from '../../util/general';

import { usePublicAddresses } from '../../util/hooks';
import useQuery from '../../hooks/useQuery';
import { useGetMappedErrorRedirect } from '../../hooks/fio';

import {
  TOKEN_LINK_MIN_WAIT_TIME,
  BUNDLES_TX_COUNT,
} from '../../constants/fio';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';
import { CHAIN_CODES } from '../../constants/common';

import { CheckedTokenType, DeleteTokenContextProps } from './types';
import {
  LinkActionResult,
  PublicAddressDoublet,
  WalletKeys,
} from '../../types';

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
  const [submitData, setSubmitData] = useState<boolean | null>(null);
  const [resultsData, setResultsData] = useState<LinkActionResult>(null);

  const {
    edgeWalletId = '',
    remaining = 0,
    publicAddresses = [],
    walletPublicKey = '',
  } = fioCryptoHandleObj || {};

  const hasLowBalance = remaining - bundleCost < 0 || remaining === 0;

  const hasChecked = pubAddressesArr.some(pubAddress => pubAddress.isChecked);

  const hasSocialMediaLinks = publicAddresses.some(
    publicAddress => publicAddress.chainCode === CHAIN_CODES.SOCIALS,
  );

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
    hasChecked
      ? changeBundleCost(BUNDLES_TX_COUNT.REMOVE_PUBLIC_ADDRESS)
      : changeBundleCost(0);
  }, [hasChecked]);

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

  const onSuccess = () => {
    setProcessing(false);
  };

  const onCancel = () => {
    setSubmitData(null);
    setProcessing(false);
  };

  const submit = async ({ keys }: { keys: WalletKeys }) => {
    const params: {
      fioAddress: string;
      disconnectList: PublicAddressDoublet[];
      keys: WalletKeys;
      disconnectAll?: boolean;
    } = {
      fioAddress: fioCryptoHandleName,
      disconnectList: pubAddressesArr.filter(pubAddress => {
        const { isChecked, chainCode, tokenCode } = pubAddress;
        const isFioToken =
          chainCode === CHAIN_CODES.FIO && tokenCode === CHAIN_CODES.FIO;
        return isChecked && !isFioToken;
      }),
      keys,
      disconnectAll: allChecked && !hasSocialMediaLinks,
    };
    try {
      const actionResults = await minWaitTimeFunction(
        () => linkTokens(params),
        TOKEN_LINK_MIN_WAIT_TIME,
      );
      setResultsData(actionResults);
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
    allChecked,
    bundleCost,
    edgeWalletId,
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
    submit,
  };
};
