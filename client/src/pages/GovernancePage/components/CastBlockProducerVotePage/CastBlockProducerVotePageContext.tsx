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

import { ROUTES } from '../../../../constants/routes';

import {
  BUNDLES_TX_COUNT,
  FIO_ENDPOINT_NAME,
  FIO_ENDPOINT_TAG_NAME,
} from '../../../../constants/fio';
import { DEFAULT_FEE_PRICES } from '../../../../util/prices';
import { DEFAULT_ACTION_FEE_AMOUNT, TrxResponse } from '../../../../api/fio';
import api from '../../../../api';
import MathOp from '../../../../util/math';

import { useRefreshBalancesAndFioNames } from '../../../../hooks/fio';

import { FioHandleItem } from '../../../../types/governance';
import { FeePrice, FioWalletDoublet } from '../../../../types';
import { SubmitData } from './types';

type Props = {
  selectedBlockProducersFioHandles: string[];
  resetSelectedBlockProducers: () => void;
};

type UseContextProps = {
  fioHandlesList: FioHandleItem[];
  fioHandlesLoading: boolean;
  loading: boolean;
  fioWallets: FioWalletDoublet[];
  prices: FeePrice;
  processing: boolean;
  resultsData: TransactionDetailsProps;
  selectedFioHandle: FioHandleItem;
  selectedFioWallet: FioWalletDoublet;
  submitData: SubmitData;
  transactionDetails: TransactionDetailsProps;
  onActionClick: () => void;
  onCancel: () => void;
  onFioHandleChange: (id: string) => void;
  onResultsClose: () => void;
  onSuccess: (results: TrxResponse) => void;
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
  const [resultsData, setResulstData] = useState<TransactionDetailsProps>(null);

  const dispatch = useDispatch();
  const history = useHistory();

  useRefreshBalancesAndFioNames();

  const prices = fees[FIO_ENDPOINT_NAME.voteproducer] || DEFAULT_FEE_PRICES;

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
      fee: BUNDLES_TX_COUNT.VOTE_BLOCK_PRODUCER,
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

  const onSuccess = useCallback(
    async (results: TrxResponse) => {
      if (results?.transaction_id) {
        const resultsDataObj: TransactionDetailsProps = {
          payWith: {
            walletName: selectedFioWallet?.name,
            walletBalances: {
              nativeFio: selectedFioWallet?.available,
              fio: FIOSDK.SUFToAmount(selectedFioWallet?.available).toFixed(2),
              usdc: api.fio
                .convertFioToUsdc(selectedFioWallet?.available, roe)
                ?.toString(),
            },
          },
          additional: [
            {
              label: 'ID',
              value: results.transaction_id,
              link: `${process.env.REACT_APP_FIO_BLOCKS_TX_URL}${results.transaction_id}`,
              wrap: true,
            },
          ],
        };

        if (results.fee_collected) {
          resultsDataObj.feeInFio = results.fee_collected;
          const freshWalletBalance = await api.fio.getBalance(
            selectedFioWallet?.publicKey,
          );
          resultsDataObj.payWith.walletBalances = {
            nativeFio: freshWalletBalance?.available,
            fio: FIOSDK.SUFToAmount(freshWalletBalance?.available).toFixed(2),
            usdc: api.fio
              .convertFioToUsdc(freshWalletBalance?.available, roe)
              ?.toString(),
          };
        } else {
          resultsDataObj.bundles = {
            remaining: new MathOp(selectedFioHandle?.remaining)
              .sub(BUNDLES_TX_COUNT.VOTE_BLOCK_PRODUCER)
              .toNumber(),
            fee: BUNDLES_TX_COUNT.VOTE_BLOCK_PRODUCER,
          };
        }

        setResulstData(resultsDataObj);
      }

      setProcessing(false);
    },
    [
      roe,
      selectedFioHandle?.remaining,
      selectedFioWallet?.available,
      selectedFioWallet?.name,
      selectedFioWallet?.publicKey,
    ],
  );

  const onResultsClose = () => {
    resetSelectedBlockProducers();
    history.push(ROUTES.GOVERNANCE_BLOCK_PRODUCERS);
    setResulstData(null);
  };

  const onActionClick = () => {
    setSubmitData({
      action: FIO_ENDPOINT_TAG_NAME.voteProducer,
      account: Account.eosio,
      data: {
        actor: FIOSDK.accountHash(selectedFioWallet.publicKey).accountnm,
        producers: selectedBlockProducersFioHandles,
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
    return dispatch(
      getFee(FIO_ENDPOINT_NAME[FIO_ENDPOINT_TAG_NAME.voteProducer]),
    );
  }, [dispatch]);

  return {
    fioHandlesList,
    fioHandlesLoading,
    loading,
    fioWallets,
    prices,
    processing,
    resultsData,
    selectedFioHandle,
    selectedFioWallet,
    submitData,
    transactionDetails,
    onActionClick,
    onCancel,
    onFioHandleChange,
    onSuccess,
    onResultsClose,
    onWalletChange,
    setProcessing,
  };
};
