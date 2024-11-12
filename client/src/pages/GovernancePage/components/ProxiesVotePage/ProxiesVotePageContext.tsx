import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { Account, FIOSDK } from '@fioprotocol/fiosdk';

import {
  fioAddresses as fioAddressesSelector,
  fioAddressesLoading as fioAddressesLoadingSelector,
  fioWallets as fioWalletsSelector,
  loading as loadingSelector,
  fees as feesSelector,
} from '../../../../redux/fio/selectors';
import { roe as roeSelector } from '../../../../redux/registrations/selectors';

import { getFee } from '../../../../redux/fio/actions';

import { TransactionDetailsProps } from '../../../../components/TransactionDetails/TransactionDetails';

import {
  BUNDLES_TX_COUNT,
  FIO_ENDPOINT_NAME,
  FIO_ENDPOINT_TAG_NAME,
} from '../../../../constants/fio';
import { ROUTES } from '../../../../constants/routes';
import { DEFAULT_FEE_PRICES } from '../../../../util/prices';
import { DEFAULT_ACTION_FEE_AMOUNT, TrxResponse } from '../../../../api/fio';

import { useRefreshBalancesAndFioNames } from '../../../../hooks/fio';
import api from '../../../../api';

import { DetailedProxy, FeePrice, FioWalletDoublet } from '../../../../types';
import { SubmitData } from './types';
import { FioHandleItem } from '../../../../types/governance';

type Props = {
  selectedProxy: DetailedProxy;
  resetSelectedProxies: () => void;
};

type UseContextProps = {
  fioHandlesList: FioHandleItem[];
  fioHandlesLoading: boolean;
  loading: boolean;
  fioWallets: FioWalletDoublet[];
  prices: FeePrice;
  processing: boolean;
  selectedFioHandle: FioHandleItem;
  selectedFioWallet: FioWalletDoublet;
  submitData: SubmitData;
  transactionDetails: TransactionDetailsProps;
  onActionClick: () => void;
  onCancel: () => void;
  onFioHandleChange: (id: string) => void;
  onSuccess: (results: TrxResponse) => void;
  onWalletChange: (id: string) => void;
  setProcessing: (processing: boolean) => void;
};

export const useContext = (props: Props): UseContextProps => {
  const { selectedProxy, resetSelectedProxies } = props;

  const fioWallets = useSelector(fioWalletsSelector);
  const fioHandles = useSelector(fioAddressesSelector);
  const fioHandlesLoading = useSelector(fioAddressesLoadingSelector);
  const loading = useSelector(loadingSelector);
  const fees = useSelector(feesSelector);
  const roe = useSelector(roeSelector);

  const [processing, setProcessing] = useState<boolean>(false);
  const [submitData, setSubmitData] = useState<SubmitData | null>(null);

  const [selectedFioWalletId, setSelectedFioWalletId] = useState<string | null>(
    fioWallets[0]?.id || null,
  );
  const [selectedFioHandleId, setSelectedFioHandleId] = useState<string | null>(
    null,
  );

  const dispatch = useDispatch();
  const history = useHistory();

  useRefreshBalancesAndFioNames();

  const prices = fees[FIO_ENDPOINT_NAME.voteproxy] || DEFAULT_FEE_PRICES;

  const selectedFioWallet = fioWallets?.find(
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
    fioHandlesList?.find(({ id }) => id === selectedFioHandleId) ||
    fioHandlesList[0];

  const transactionDetails: TransactionDetailsProps = {};

  if (selectedFioHandle && selectedFioHandle?.remaining) {
    transactionDetails.bundles = {
      remaining: selectedFioHandle?.remaining,
      fee: BUNDLES_TX_COUNT.VOTE_PROXY,
    };
  } else {
    transactionDetails.feeInFio = prices.nativeFio;
    transactionDetails.payWith = {
      walletBalances: {
        nativeFio: selectedFioWallet?.available,
        fio: FIOSDK.SUFToAmount(selectedFioWallet?.available).toFixed(2),
        usdc: api.fio
          .convertFioToUsdc(selectedFioWallet?.available, roe)
          ?.toString(),
      },
      walletName: selectedFioWallet?.name,
    };
  }

  const onCancel = () => {
    setSubmitData(null);
    setProcessing(false);
  };

  const onSuccess = (results: TrxResponse) => {
    setProcessing(false);

    if (results?.transaction_id) {
      resetSelectedProxies();
      history.push(ROUTES.GOVERNANCE_PROXIES);
    }
  };

  const onActionClick = () => {
    setSubmitData({
      action: FIO_ENDPOINT_TAG_NAME.voteProxy,
      account: Account.eosio,
      data: {
        actor: FIOSDK.accountHash(selectedFioWallet?.publicKey)?.accountnm,
        proxy: selectedProxy?.fioAddress,
        fio_address: selectedFioHandle?.name || '',
        max_fee: DEFAULT_ACTION_FEE_AMOUNT,
      },
    });
  };

  const onWalletChange = useCallback((walletId: string) => {
    setSelectedFioWalletId(walletId);
  }, []);

  const onFioHandleChange = useCallback((fioHandleId: string) => {
    setSelectedFioHandleId(fioHandleId);
  }, []);

  useEffect(() => {
    return dispatch(getFee(FIO_ENDPOINT_NAME[FIO_ENDPOINT_TAG_NAME.voteProxy]));
  }, [dispatch]);

  return {
    fioHandlesList,
    fioHandlesLoading,
    fioWallets,
    loading,
    prices,
    processing,
    selectedFioHandle,
    selectedFioWallet,
    submitData,
    transactionDetails,
    onActionClick,
    onCancel,
    onFioHandleChange,
    onSuccess,
    onWalletChange,
    setProcessing,
  };
};
