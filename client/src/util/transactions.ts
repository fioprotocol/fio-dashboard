import { Account, FIOSDK } from '@fioprotocol/fiosdk';

import apis from '../api';

import { FIO_CHAIN_CODE, WALLET_HISTORY_NODE_LIMIT } from '../constants/fio';

import MathOp from './math';
import { getUTCDate, log } from './general';
import config from '../config';

import { FioWalletTxHistory, TransactionItemProps } from '../types';
import { TransactionDetailsProps } from '../components/TransactionDetails/TransactionDetails';
import { HandleTransactionDetailsProps } from '../types/transactions';
import {
  FioHistoryV2NodeAction,
  FioHistoryV2NodeActionResponse,
} from '../types/fio';

const HISTORY_TX_NAMES = {
  TRANSFER_PUB_KEY: 'trnsfiopubky',
  TRANSFER: 'transfer',
};

const updateTx = (
  newTx: TransactionItemProps,
  txList: TransactionItemProps[],
): boolean => {
  const existingIndex = txList.findIndex(({ txId }) => txId === newTx.txId);

  if (existingIndex > -1) {
    txList[existingIndex].nativeAmount = newTx.nativeAmount;
    txList[existingIndex].networkFee = newTx.networkFee;
    txList[existingIndex].otherParams = newTx.otherParams;
    if (!txList[existingIndex].timestamp) {
      txList[existingIndex].timestamp = newTx.timestamp;
    }
    return true;
  }

  txList.push(newTx);

  return false;
};

const processTransaction = (
  publicKey: string,
  action: FioHistoryV2NodeAction,
  actor: string,
  transactions: TransactionItemProps[],
  lastTxActionTime: string,
): { editedExisting: boolean; timestamp: string } => {
  const {
    act: { name: trxName, data },
  } = action;
  let nativeAmount;
  let actorSender;
  let networkFee = '0';
  let otherParams: {
    isTransferProcessed?: boolean;
    isFeeProcessed?: boolean;
    feeActors?: string[];
  } = {};
  let editedExisting = false;
  const currencyCode = FIO_CHAIN_CODE;
  const ourReceiveAddresses = [];
  if (
    lastTxActionTime &&
    new Date(action.timestamp) < new Date(lastTxActionTime)
  ) {
    return { timestamp: action.timestamp, editedExisting };
  }
  if (
    trxName !== HISTORY_TX_NAMES.TRANSFER_PUB_KEY &&
    trxName !== HISTORY_TX_NAMES.TRANSFER
  ) {
    return { timestamp: action.timestamp, editedExisting };
  }

  // Transfer funds transaction
  if (trxName === HISTORY_TX_NAMES.TRANSFER_PUB_KEY && data.amount != null) {
    nativeAmount = data.amount.toString();
    const amount = `${FIOSDK.SUFToAmount(nativeAmount)}`;
    actorSender = data.actor;
    if (data.payee_public_key === publicKey) {
      ourReceiveAddresses.push(publicKey);
      if (actorSender === actor) {
        nativeAmount = '0';
      }
    } else {
      nativeAmount = `-${nativeAmount}`;
    }

    const index = transactions.findIndex(
      ({ currencyCode: trxCurrencyCode, txId }) =>
        currencyCode === trxCurrencyCode && txId === action.trx_id,
    );

    // Check if fee transaction have already added
    if (index > -1) {
      const existingTrx: TransactionItemProps = transactions[index];
      otherParams = { ...existingTrx.otherParams };
      if (!existingTrx.timestamp) {
        transactions[index].timestamp = action.timestamp;
      }
      if (+nativeAmount > 0) {
        return { timestamp: action.timestamp, editedExisting };
      }
      if (otherParams.isTransferProcessed) {
        return { timestamp: action.timestamp, editedExisting };
      }
      if (otherParams.isFeeProcessed) {
        nativeAmount = `${+nativeAmount - +existingTrx.networkFee}`;
        networkFee = existingTrx.networkFee;
      } else {
        log.error(
          'processTransaction error - existing spend transaction should have isTransferProcessed or isFeeProcessed set',
        );
      }
    }
    otherParams.isTransferProcessed = true;

    editedExisting = updateTx(
      {
        txId: action.trx_id,
        timestamp: action.timestamp,
        date: getUTCDate(action.timestamp) / 1000,
        currencyCode,
        blockHeight: action.block_num > 0 ? action.block_num : 0,
        nativeAmount,
        amount,
        networkFee,
        otherParams,
      },
      transactions,
    );
  }

  // Fee transaction
  if (trxName === HISTORY_TX_NAMES.TRANSFER && data.amount != null) {
    const fioAmount = apis.fio.amountToSUF(parseFloat(`${data.amount}`));
    otherParams.feeActors = [data?.to];
    if (data?.to === actor) {
      nativeAmount = `${fioAmount}`;
    } else {
      nativeAmount = `-${fioAmount}`;
      networkFee = `${fioAmount}`;
    }

    const index = transactions.findIndex(
      ({ currencyCode: trxCurrencyCode, txId }) =>
        currencyCode === trxCurrencyCode && txId === action.trx_id,
    );

    // Check if transfer transaction have already added
    if (index > -1) {
      const existingTrx: TransactionItemProps = transactions[index];
      otherParams = { ...existingTrx.otherParams };
      if (!existingTrx.timestamp) {
        transactions[index].timestamp = action.timestamp;
      }
      if (
        +existingTrx.nativeAmount > 0 &&
        otherParams?.feeActors?.includes(data?.to)
      ) {
        return { timestamp: action.timestamp, editedExisting };
      }
      if (otherParams.isFeeProcessed) {
        if (!otherParams?.feeActors?.includes(data?.to)) {
          otherParams?.feeActors?.push(data?.to);

          if (data?.to === actor) {
            nativeAmount = new MathOp(existingTrx.nativeAmount)
              .add(fioAmount)
              .toString();
          } else {
            nativeAmount = new MathOp(existingTrx.nativeAmount)
              .sub(fioAmount)
              .toString();
            networkFee = new MathOp(existingTrx.networkFee)
              .add(fioAmount)
              .toString();
          }
        } else {
          return { timestamp: action.timestamp, editedExisting };
        }
      }
      if (otherParams?.isTransferProcessed) {
        nativeAmount = `${+existingTrx.nativeAmount - +networkFee}`;
      } else {
        log.error(
          'processTransaction error - existing spend transaction should have isTransferProcessed or isFeeProcessed set',
        );
      }
    }

    otherParams.isFeeProcessed = true;
    editedExisting = updateTx(
      {
        txId: action.trx_id,
        date: getUTCDate(action.timestamp) / 1000,
        timestamp: action.timestamp,
        currencyCode,
        blockHeight: action.block_num > 0 ? action.block_num : 0,
        nativeAmount,
        amount: `${data.amount}`,
        networkFee,
        otherParams,
      },
      transactions,
    );
  }

  return {
    timestamp: action.timestamp,
    editedExisting,
  };
};

export const checkTransactions = async (
  publicKey: string,
  currentHistory: FioWalletTxHistory,
  updateHistory: (history: FioWalletTxHistory, publicKey: string) => void,
  historyNodeIndex: number = 0,
): Promise<TransactionItemProps[]> => {
  const transactions: TransactionItemProps[] = currentHistory.txs
    ? [...currentHistory.txs]
    : [];

  const lastTxActionTime = currentHistory.lastTxActionTime;

  let lastActionTime = '';
  const actor = apis.fio.publicFioSDK.transactions.getActor(publicKey);
  const actionParams = {
    account: actor,
    limit: WALLET_HISTORY_NODE_LIMIT,
    'act.account': Account.token,
  };
  const fioHistoryUrls = await apis.fioReg.historyUrls();

  apis.fioHistory.setHistoryNodeUrls(fioHistoryUrls);

  try {
    const lastActionObject: Partial<{
      error?: { noNodeForIndex: boolean };
    } & FioHistoryV2NodeActionResponse> = await apis.fioHistory.getHistoryV2Actions(
      {
        nodeIndex: historyNodeIndex,
        params: { ...actionParams, limit: 1 },
      },
    );

    if (lastActionObject.error && lastActionObject.error.noNodeForIndex) {
      // no more history nodes left
      return [];
    }
    if (lastActionObject.actions.length) {
      lastActionTime = lastActionObject.actions[0].timestamp;
    } else {
      // if no transactions at all
      if (lastTxActionTime === '') return [];
      updateHistory(
        {
          lastTxActionTime: '',
          txs: [],
        },
        publicKey,
      );
      return [];
    }
  } catch (e) {
    log.error('History request error. ', e);
    return checkTransactions(
      publicKey,
      currentHistory,
      updateHistory,
      ++historyNodeIndex,
    );
  }

  let before = lastActionTime;
  let finish = false;
  let listWasUpdated = false;

  while (!finish) {
    if (
      lastTxActionTime &&
      new Date(lastTxActionTime) >= new Date(lastActionTime)
    ) {
      break;
    }

    try {
      const actionsObject = await apis.fioHistory.getHistoryV2Actions({
        params: { ...actionParams, before },
        nodeIndex: historyNodeIndex,
      });

      if (actionsObject.error && actionsObject.error.noNodeForIndex) {
        return [];
      }

      let actions = [];

      if (actionsObject.actions && actionsObject.actions.length > 0) {
        actions = actionsObject.actions;
      } else {
        break;
      }

      for (let i = 0; i < actions.length; i++) {
        const action = actions[i];

        const { timestamp, editedExisting } = processTransaction(
          publicKey,
          action,
          actor,
          transactions,
          lastTxActionTime,
        );

        if (editedExisting) listWasUpdated = true;

        if (
          lastTxActionTime &&
          new Date(timestamp) < new Date(lastTxActionTime)
        ) {
          finish = true;
          break;
        }
      }

      if (
        !actions.length ||
        new MathOp(actionsObject.total.value).lte(actions.length)
      ) {
        break;
      }
      before = actions[actions.length - 1].timestamp;
    } catch (e) {
      log.error('History request error. ', e);
      return checkTransactions(
        publicKey,
        currentHistory,
        updateHistory,
        ++historyNodeIndex,
      );
    }
  }

  const sortedTxns = transactions.sort((tx1, tx2) =>
    tx1.date < tx2.date ? 1 : -1,
  );
  const newLastTxActionTime = sortedTxns[0]?.timestamp;

  if (
    (!lastTxActionTime && newLastTxActionTime) ||
    (lastTxActionTime &&
      new Date(newLastTxActionTime) > new Date(lastTxActionTime)) ||
    listWasUpdated
  ) {
    updateHistory(
      {
        lastTxActionTime: newLastTxActionTime,
        txs: sortedTxns,
      },
      publicKey,
    );
  }

  return transactions;
};

export const handleTransactionDetails = ({
  bundles,
  feeCollected,
  fioWallet,
  roe,
  remaningBundles,
  shouldSubBundlesFromRemaining,
  shouldSubFeesFromBalance,
  transactionId,
}: HandleTransactionDetailsProps): TransactionDetailsProps => {
  const transactionDetails: TransactionDetailsProps = {};

  if (transactionId) {
    transactionDetails.additional = [
      {
        label: 'ID',
        value: transactionId,
        link: `${process.env.REACT_APP_FIO_BLOCKS_TX_URL}${transactionId}`,
        wrap: true,
      },
    ];
  }

  if (fioWallet) {
    transactionDetails.payWith = {
      walletName: fioWallet?.name,
      walletBalances: {
        nativeFio: fioWallet?.balance,
        fio: FIOSDK.SUFToAmount(fioWallet?.balance).toFixed(2),
        usdc: apis.fio.convertFioToUsdc(fioWallet?.balance, roe)?.toString(),
      },
    };
  }

  if (feeCollected) {
    transactionDetails.feeInFio = feeCollected;

    const walletBalance = shouldSubFeesFromBalance
      ? new MathOp(fioWallet?.balance).sub(feeCollected).toNumber()
      : fioWallet?.balance;

    transactionDetails.payWith.walletBalances = {
      nativeFio: walletBalance,
      fio: FIOSDK.SUFToAmount(walletBalance).toFixed(2),
      usdc: apis.fio.convertFioToUsdc(walletBalance, roe)?.toString(),
    };
  }

  if (remaningBundles && bundles) {
    transactionDetails.bundles = {
      remaining: shouldSubBundlesFromRemaining
        ? new MathOp(remaningBundles).sub(bundles).toNumber()
        : remaningBundles,
      fee: bundles,
    };
  }

  return transactionDetails;
};

export const lowBalanceAction = (): void => {
  const url = config.getTokensUrl;
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.click();
};
