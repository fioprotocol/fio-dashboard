import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { FIOSDK } from '@fioprotocol/fiosdk';

import {
  fioAddresses as fioAddressesSelector,
  fioAddressesLoading as fioAddressesLoadingSelector,
  fioWallets as fioWalletsSelector,
  loading as loadingSelector,
} from '../../../../redux/fio/selectors';

import { refreshBalance, refreshFioNames } from '../../../../redux/fio/actions';

import { ROUTES } from '../../../../constants/routes';
import { DEFAULT_MAX_FEE_MULTIPLE_AMOUNT } from '../../../../constants/fio';

import useEffectOnce from '../../../../hooks/general';

import { FioHandleItem } from '../../../../types/governance';
import { FioWalletDoublet } from '../../../../types';

type Props = {
  selectedBlockProducersFioHandles: string[];
  resetSelectedBlockProducers: () => void;
};

type UseContextProps = {
  fioHandlesList: FioHandleItem[];
  fioHandlesLoading: boolean;
  loading: boolean;
  fioWallets: FioWalletDoublet[];
  processing: boolean;
  selectedFioHandle: FioHandleItem;
  selectedFioWallet: FioWalletDoublet;
  submitData: any;
  onActionClick: () => void;
  onCancel: () => void;
  onFioHandleChange: (id: string) => void;
  onSuccess: (results: any) => void;
  onWalletChange: (id: string) => void;
  setProcessing: (processing: boolean) => void;
};

export const useContext = (props: Props): UseContextProps => {
  const {
    selectedBlockProducersFioHandles,
    resetSelectedBlockProducers,
  } = props;

  const fioWallets = useSelector(fioWalletsSelector);
  const fioHandles = useSelector(fioAddressesSelector);
  const fioHandlesLoading = useSelector(fioAddressesLoadingSelector);
  const loading = useSelector(loadingSelector);

  const [
    selectedFioWallet,
    setSelectedFioWallet,
  ] = useState<FioWalletDoublet | null>(null);
  const [
    selectedFioHandle,
    setSelectedFioHandle,
  ] = useState<FioHandleItem | null>(null);

  const [processing, setProcessing] = useState<boolean>(false);
  const [submitData, setSubmitData] = useState<any | null>(null);
  const [fioHandlesList, setFioHandlesList] = useState<FioHandleItem[]>([]);

  const dispatch = useDispatch();
  const history = useHistory();

  const onCancel = () => {
    setSubmitData(null);
    setProcessing(false);
  };

  const onSuccess = (results: any) => {
    setProcessing(false);

    if (results?.transaction_id) {
      resetSelectedBlockProducers();
      history.push(ROUTES.GOVERNANCE_BLOCK_PRODUCERS);
    }
  };

  const onActionClick = () => {
    setSubmitData({
      producers: selectedBlockProducersFioHandles,
      fioAddress: selectedFioHandle?.name,
      max_fee: DEFAULT_MAX_FEE_MULTIPLE_AMOUNT,
      actor: FIOSDK.accountHash(selectedFioWallet.publicKey).accountnm,
    });
  };

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
      const walletToSelect = fioWallets.find(({ id }) => id === walletId);

      setFioHandlesList(findWalletsFioHandles(walletToSelect.publicKey));
      setSelectedFioWallet(walletToSelect);
    },
    [findWalletsFioHandles, fioWallets],
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
    fioWallets,
    processing,
    selectedFioHandle,
    selectedFioWallet,
    submitData,
    onActionClick,
    onCancel,
    onFioHandleChange,
    onSuccess,
    onWalletChange,
    setProcessing,
  };
};
