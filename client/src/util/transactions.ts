import apis from '../api';

import { FIO_CHAIN_CODE } from '../constants/fio';

import MathOp from './math';
import { getUTCDate, log } from './general';

import {
  FioHistoryNodeAction,
  FioWalletTxHistory,
  TransactionItemProps,
} from '../types';

const HISTORY_NODE_OFFSET = 20;
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
    return true;
  }

  txList.push(newTx);

  return false;
};

const processTransaction = (
  publicKey: string,
  action: FioHistoryNodeAction,
  actor: string,
  transactions: TransactionItemProps[],
  highestTxHeight: number,
): { blockNum: number; editedExisting: boolean } => {
  const {
    act: { name: trxName, data },
  } = action.action_trace;
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
  if (action.block_num <= highestTxHeight) {
    return { blockNum: action.block_num, editedExisting };
  }
  if (
    trxName !== HISTORY_TX_NAMES.TRANSFER_PUB_KEY &&
    trxName !== HISTORY_TX_NAMES.TRANSFER
  ) {
    return { blockNum: action.block_num, editedExisting };
  }

  // Transfer funds transaction
  if (trxName === HISTORY_TX_NAMES.TRANSFER_PUB_KEY && data.amount != null) {
    nativeAmount = data.amount.toString();
    const amount = `${apis.fio.sufToAmount(parseInt(nativeAmount, 10))}`;
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
        currencyCode === trxCurrencyCode && txId === action.action_trace.trx_id,
    );

    // Check if fee transaction have already added
    if (index > -1) {
      const existingTrx: TransactionItemProps = transactions[index];
      otherParams = { ...existingTrx.otherParams };
      if (+nativeAmount > 0) {
        return { blockNum: action.block_num, editedExisting };
      }
      if (otherParams.isTransferProcessed) {
        return { blockNum: action.block_num, editedExisting };
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
        txId: action.action_trace.trx_id,
        date: getUTCDate(action.block_time) / 1000,
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
  if (trxName === HISTORY_TX_NAMES.TRANSFER && data.quantity != null) {
    const [amount] = data.quantity.split(' ');
    const fioAmount = apis.fio.amountToSUF(parseFloat(amount));
    otherParams.feeActors = [data.to];
    if (data.to === actor) {
      nativeAmount = `${fioAmount}`;
    } else {
      nativeAmount = `-${fioAmount}`;
      networkFee = `${fioAmount}`;
    }

    const index = transactions.findIndex(
      ({ currencyCode: trxCurrencyCode, txId }) =>
        currencyCode === trxCurrencyCode && txId === action.action_trace.trx_id,
    );

    // Check if transfer transaction have already added
    if (index > -1) {
      const existingTrx: TransactionItemProps = transactions[index];
      otherParams = { ...existingTrx.otherParams };
      if (
        +existingTrx.nativeAmount > 0 &&
        otherParams.feeActors.includes(data.to)
      ) {
        return { blockNum: action.block_num, editedExisting };
      }
      if (otherParams.isFeeProcessed) {
        if (!otherParams.feeActors.includes(data.to)) {
          otherParams.feeActors.push(data.to);

          if (data.to === actor) {
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
          return { blockNum: action.block_num, editedExisting };
        }
      }
      if (otherParams.isTransferProcessed) {
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
        txId: action.action_trace.trx_id,
        date: getUTCDate(action.block_time) / 1000,
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

  return {
    blockNum: action.block_num,
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

  let newHighestTxHeight = currentHistory.highestTxHeight || 0;

  let lastActionSeqNumber = 0;
  const actor = apis.fio.publicFioSDK.transactions.getActor(publicKey);

  try {
    const lastActionObject: {
      actions?: FioHistoryNodeAction[];
      error?: { noNodeForIndex: boolean };
    } = await apis.fioHistory.requestHistory(historyNodeIndex, {
      account_name: actor,
      pos: -1,
      offset: -1,
    });

    if (lastActionObject.error && lastActionObject.error.noNodeForIndex) {
      // no more history nodes left
      return [];
    }

    if (lastActionObject.actions.length) {
      lastActionSeqNumber = lastActionObject.actions[0].account_action_seq;
    } else {
      // if no transactions at all
      if (currentHistory.highestTxHeight === 0) return [];

      updateHistory(
        {
          highestTxHeight: 0,
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

  let pos = lastActionSeqNumber;
  let finish = false;
  let listWasUpdated = false;

  while (!finish) {
    if (pos < 0) {
      break;
    }
    let actionsObject;
    try {
      actionsObject = await apis.fioHistory.requestHistory(historyNodeIndex, {
        account_name: actor,
        pos,
        offset: -HISTORY_NODE_OFFSET + 1,
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

      for (let i = actions.length - 1; i > -1; i--) {
        const action = actions[i];

        const { blockNum, editedExisting } = processTransaction(
          publicKey,
          action,
          actor,
          transactions,
          currentHistory.highestTxHeight,
        );

        if (editedExisting) listWasUpdated = true;

        if (blockNum > newHighestTxHeight) {
          newHighestTxHeight = blockNum;
        } else if (
          (blockNum === newHighestTxHeight && i === HISTORY_NODE_OFFSET - 1) ||
          blockNum < currentHistory.highestTxHeight
        ) {
          finish = true;
          break;
        }
      }

      if (!actions.length || actions.length < HISTORY_NODE_OFFSET) {
        break;
      }
      pos -= HISTORY_NODE_OFFSET;
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
  if (newHighestTxHeight > currentHistory.highestTxHeight || listWasUpdated) {
    updateHistory(
      {
        highestTxHeight: newHighestTxHeight,
        txs: transactions.sort((tx1, tx2) => (tx1.date < tx2.date ? 1 : -1)),
      },
      publicKey,
    );
  }

  return transactions;
};
