import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { refreshBalance, refreshFioNames } from '../../../../redux/fio/actions';

import {
  fioAddresses as fioAddressesSelector,
  fioAddressesLoading as fioAddressesLoadingSelector,
  fioWallets as fioWalletsSelector,
  loading as loadingSelector,
} from '../../../../redux/fio/selectors';

import useEffectOnce from '../../../../hooks/general';

import config from '../../../../config';
import { BUNDLES_TX_COUNT, FIO_CHAIN_CODE } from '../../../../constants/fio';
import { ROUTES } from '../../../../constants/routes';

import { FioAddressDoublet, FioWalletDoublet } from '../../../../types';
import { RequestTokensValues } from '../../../FioTokensRequestPage/types';
import { CandidateProps } from '../../../../types/governance';
import { TrxResponsePaidBundles } from '../../../../api/fio';

type FioHandleItem = FioAddressDoublet & { id: string };

type UseContextProps = {
  fioHandlesList: FioHandleItem[];
  fioHandlesLoading: boolean;
  loading: boolean;
  notEnoughBundles: boolean;
  processing: boolean;
  submitData: RequestTokensValues;
  selectedFioHandle: FioHandleItem;
  selectedFioWallet: FioWalletDoublet;
  walletsList: FioWalletDoublet[];
  onActionClick: () => void;
  onCancel: () => void;
  onSuccess: (results: TrxResponsePaidBundles) => void;
  onFioHandleChange: (id: string) => void;
  onWalletChange: (id: string) => void;
  setProcessing: (processing: boolean) => void;
};

type Props = {
  selectedCandidates: CandidateProps[];
  resetSelectedCandidates: () => void;
};

export const useContext = (props: Props): UseContextProps => {
  const { selectedCandidates, resetSelectedCandidates } = props;

  const fioWallets = useSelector(fioWalletsSelector);
  const fioHandles = useSelector(fioAddressesSelector);
  const fioHandlesLoading = useSelector(fioAddressesLoadingSelector);
  const loading = useSelector(loadingSelector);

  const [walletsList, setWalletsList] = useState<FioWalletDoublet[]>([]);
  const [fioHandlesList, setFioHandlesList] = useState<FioHandleItem[]>([]);
  const [
    selectedFioWallet,
    setSelectedFioWallet,
  ] = useState<FioWalletDoublet | null>(null);
  const [
    selectedFioHandle,
    setSelectedFioHandle,
  ] = useState<FioHandleItem | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [submitData, setSubmitData] = useState<RequestTokensValues | null>(
    null,
  );

  const notEnoughBundles =
    selectedFioHandle != null
      ? selectedFioHandle.remaining < BUNDLES_TX_COUNT.NEW_FIO_REQUEST
      : false;

  const dispatch = useDispatch();
  const history = useHistory();

  const findWalletsFioHandles = useCallback(
    (publicKey: string) =>
      fioHandles
        .filter(({ walletPublicKey }) => walletPublicKey === publicKey)
        .map(fioHandleItem => ({
          ...fioHandleItem,
          id: fioHandleItem?.name,
        })),
    [fioHandles],
  );

  const onWalletChange = useCallback(
    (walletId: string) => {
      const walletToSelect = walletsList.find(({ id }) => id === walletId);

      setFioHandlesList(findWalletsFioHandles(walletToSelect.publicKey));
      setSelectedFioWallet(walletToSelect);
    },
    [findWalletsFioHandles, walletsList],
  );

  const onFioHandleChange = useCallback(
    (fioHandleId: string) => {
      const fioHandleToSelect = fioHandlesList.find(
        ({ id }) => id === fioHandleId,
      );

      setSelectedFioHandle(fioHandleToSelect);
    },
    [fioHandlesList],
  );

  const onCancel = () => {
    setSubmitData(null);
    setProcessing(false);
  };

  const onSuccess = (results: TrxResponsePaidBundles) => {
    setProcessing(false);

    if (results?.transaction_id) {
      resetSelectedCandidates();
      history.push(ROUTES.GOVERNANCE_FIO_FOUNDATION_BOARD_OF_DIRECTORS);
    }
  };

  const onActionClick = () => {
    setSubmitData({
      payeeFioAddress: selectedFioHandle.name,
      payerFioAddress: config.voteFioHandle,
      chainCode: FIO_CHAIN_CODE,
      tokenCode: FIO_CHAIN_CODE,
      payeeTokenPublicAddress: selectedFioHandle.walletPublicKey,
      amount: '1',
      memo: selectedCandidates.map(({ id }) => id).join(','),
    });
  };

  useEffect(() => {
    if (fioWallets) {
      setWalletsList(fioWallets);
    } else {
      setWalletsList([]);
    }
  }, [fioWallets]);

  useEffect(() => {
    if (fioHandlesList) {
      setSelectedFioHandle(fioHandlesList[0]);
    }
  }, [fioHandlesList]);

  useEffectOnce(
    () => {
      for (const fioWallet of fioWallets) {
        if (fioWallet.publicKey) {
          dispatch(refreshBalance(fioWallet.publicKey));
          dispatch(refreshFioNames(fioWallet.publicKey));
        }
      }

      const walletToSelect = fioWallets[0];
      setSelectedFioWallet(walletToSelect);
      setFioHandlesList(findWalletsFioHandles(walletToSelect.publicKey));
    },
    [],
    !!fioWallets?.length && !loading && !fioHandlesLoading,
  );

  return {
    fioHandlesList,
    fioHandlesLoading,
    loading,
    notEnoughBundles,
    processing,
    submitData,
    selectedFioHandle,
    selectedFioWallet,
    walletsList,
    onActionClick,
    onCancel,
    onSuccess,
    onFioHandleChange,
    onWalletChange,
    setProcessing,
  };
};
