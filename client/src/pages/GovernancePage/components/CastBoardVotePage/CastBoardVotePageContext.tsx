import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import {
  fioAddresses as fioAddressesSelector,
  fioAddressesLoading as fioAddressesLoadingSelector,
  loading as loadingSelector,
} from '../../../../redux/fio/selectors';
import { siteSetings } from '../../../../redux/settings/selectors';

import { BUNDLES_TX_COUNT, FIO_CHAIN_CODE } from '../../../../constants/fio';
import { ROUTES } from '../../../../constants/routes';
import { TrxResponse, TrxResponsePaidBundles } from '../../../../api/fio';

import { useRefreshBalancesAndFioNames } from '../../../../hooks/fio';
import { handleTransactionDetails } from '../../../../util/transactions';
import { useMakeActionOnPathChange } from '../../../../hooks/general';

import { RequestTokensValues } from '../../../FioTokensRequestPage/types';
import {
  CandidateProps,
  FioHandleItem,
  OverviewWallet,
} from '../../../../types/governance';
import { TransactionDetailsProps } from '../../../../components/TransactionDetails/TransactionDetails';
import { HandleTransactionDetailsProps } from '../../../../types/transactions';
import { VARS_KEYS } from '../../../../constants/vars';
import { QUERY_PARAMS_NAMES } from '../../../../constants/queryParams';

type UseContextProps = {
  fioHandlesList: FioHandleItem[];
  fioHandlesLoading: boolean;
  loading: boolean;
  notEnoughBundles: boolean;
  notEnoughTokens: boolean;
  processing: boolean;
  resultsData: TransactionDetailsProps;
  submitData: RequestTokensValues;
  selectedFioHandle: FioHandleItem;
  selectedFioWallet: OverviewWallet;
  voteFioHandle: string;
  onActionClick: () => void;
  onCancel: () => void;
  onLowBalanceClick: () => void;
  onResultsClose: () => void;
  onSuccess: (results: TrxResponsePaidBundles) => void;
  onFioHandleChange: (id: string) => void;
  onWalletChange: (id: string) => void;
  setProcessing: (processing: boolean) => void;
};

type Props = {
  overviewWallets: OverviewWallet[];
  selectedCandidates: CandidateProps[];
  resetSelectedCandidates: () => void;
};

export const useContext = (props: Props): UseContextProps => {
  const {
    overviewWallets,
    selectedCandidates,
    resetSelectedCandidates,
  } = props;

  const fioHandles = useSelector(fioAddressesSelector);
  const fioHandlesLoading = useSelector(fioAddressesLoadingSelector);
  const loading = useSelector(loadingSelector);
  const settings = useSelector(siteSetings);

  const voteFioHandle = settings[VARS_KEYS.VOTE_FIO_HANDLE];

  const [selectedFioWalletId, setSelectedFioWalletId] = useState<string | null>(
    overviewWallets[0]?.id || null,
  );
  const [selectedFioHandleId, setSelectedFioHandleId] = useState<string | null>(
    null,
  );
  const [processing, setProcessing] = useState<boolean>(false);
  const [submitData, setSubmitData] = useState<RequestTokensValues | null>(
    null,
  );
  const [
    resultsData,
    setResultsData,
  ] = useState<TransactionDetailsProps | null>(null);

  useMakeActionOnPathChange({
    action: resetSelectedCandidates,
    route: ROUTES.GOVERNANCE_FIO_FOUNDATION_BOARD_OF_DIRECTORS,
  });

  const selectedFioWallet = overviewWallets.find(
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

  const notEnoughTokens = !selectedFioWallet?.balance;

  const history = useHistory();

  useRefreshBalancesAndFioNames();

  const onWalletChange = useCallback((walletId: string) => {
    setSelectedFioWalletId(walletId);
  }, []);

  const onFioHandleChange = useCallback((fioHandleId: string) => {
    setSelectedFioHandleId(fioHandleId);
  }, []);

  const onLowBalanceClick = useCallback(() => {
    history.push(
      `${ROUTES.FIO_ADDRESS_ADD_BUNDLES}?${QUERY_PARAMS_NAMES.NAME}=${selectedFioHandle?.name}`,
      {
        backUrl: `${ROUTES.GOVERNANCE_FIO_FOUNDATION_BOARD_OF_DIRECTORS}`,
      },
    );
  }, [history, selectedFioHandle?.name]);

  const onCancel = () => {
    setSubmitData(null);
    setProcessing(false);
  };
  const onSuccess = useCallback(
    (results: TrxResponse) => {
      if (results?.transaction_id) {
        const transactionDetailsParams: HandleTransactionDetailsProps = {
          bundles: BUNDLES_TX_COUNT.NEW_FIO_REQUEST,
          remaningBundles: selectedFioHandle?.remaining,
          shouldSubBundlesFromRemaining: true,
          transactionId: results.transaction_id,
        };

        const resultsDataObj = handleTransactionDetails(
          transactionDetailsParams,
        );

        setResultsData(resultsDataObj);
      }

      setProcessing(false);
    },
    [selectedFioHandle?.remaining],
  );

  const onResultsClose = () => {
    resetSelectedCandidates();
    history.push(ROUTES.GOVERNANCE_FIO_FOUNDATION_BOARD_OF_DIRECTORS);
  };

  const onActionClick = () => {
    setSubmitData({
      payeeFioAddress: selectedFioHandle.name,
      payerFioAddress: voteFioHandle,
      chainCode: FIO_CHAIN_CODE,
      tokenCode: FIO_CHAIN_CODE,
      payeeTokenPublicAddress: selectedFioHandle.walletPublicKey,
      amount: '1',
      memo: selectedCandidates.map(({ id }) => id).join(','),
    });
  };

  useEffect(() => () => setResultsData(null), []);

  return {
    fioHandlesList,
    fioHandlesLoading,
    loading,
    notEnoughBundles,
    notEnoughTokens,
    processing,
    resultsData,
    submitData,
    selectedFioHandle,
    selectedFioWallet,
    voteFioHandle,
    onActionClick,
    onCancel,
    onLowBalanceClick,
    onSuccess,
    onResultsClose,
    onFioHandleChange,
    onWalletChange,
    setProcessing,
  };
};
