import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import {
  fioAddresses as fioAddressesSelector,
  fioAddressesLoading as fioAddressesLoadingSelector,
  fioWallets as fioWalletsSelector,
  loading as loadingSelector,
} from '../../../../redux/fio/selectors';

import config from '../../../../config';
import { BUNDLES_TX_COUNT, FIO_CHAIN_CODE } from '../../../../constants/fio';
import { ROUTES } from '../../../../constants/routes';
import { TrxResponsePaidBundles } from '../../../../api/fio';

import { useRefreshBalancesAndFioNames } from '../../../../hooks/fio';

import { FioWalletDoublet } from '../../../../types';
import { RequestTokensValues } from '../../../FioTokensRequestPage/types';
import { CandidateProps, FioHandleItem } from '../../../../types/governance';

type UseContextProps = {
  fioHandlesList: FioHandleItem[];
  fioHandlesLoading: boolean;
  loading: boolean;
  notEnoughBundles: boolean;
  processing: boolean;
  submitData: RequestTokensValues;
  selectedFioHandle: FioHandleItem;
  selectedFioWallet: FioWalletDoublet;
  fioWallets: FioWalletDoublet[];
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

  const [selectedFioWalletId, setSelectedFioWalletId] = useState<string | null>(
    fioWallets[0]?.id || null,
  );
  const [selectedFioHandleId, setSelectedFioHandleId] = useState<string | null>(
    null,
  );
  const [processing, setProcessing] = useState<boolean>(false);
  const [submitData, setSubmitData] = useState<RequestTokensValues | null>(
    null,
  );

  const selectedFioWallet = fioWallets.find(
    ({ id }) => id === selectedFioWalletId,
  );

  const fioHandlesList = fioHandles
    .filter(
      ({ walletPublicKey }) => walletPublicKey === selectedFioWallet?.publicKey,
    )
    .map(fioHandleItem => ({
      ...fioHandleItem,
      id: fioHandleItem?.name,
    }));

  const selectedFioHandle =
    fioHandlesList.find(({ id }) => id === selectedFioHandleId) ||
    fioHandlesList[0];

  const notEnoughBundles =
    selectedFioHandle != null
      ? selectedFioHandle.remaining < BUNDLES_TX_COUNT.NEW_FIO_REQUEST
      : false;

  const history = useHistory();

  useRefreshBalancesAndFioNames();

  const onWalletChange = useCallback((walletId: string) => {
    setSelectedFioWalletId(walletId);
  }, []);

  const onFioHandleChange = useCallback((fioHandleId: string) => {
    setSelectedFioHandleId(fioHandleId);
  }, []);

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

  return {
    fioHandlesList,
    fioHandlesLoading,
    loading,
    notEnoughBundles,
    processing,
    submitData,
    selectedFioHandle,
    selectedFioWallet,
    fioWallets,
    onActionClick,
    onCancel,
    onSuccess,
    onFioHandleChange,
    onWalletChange,
    setProcessing,
  };
};
