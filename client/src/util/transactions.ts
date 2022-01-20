import apis from '../api';
import { TransactionItemProps } from '../types';

const HISTORY_NODE_URLS = [process.env.REACT_APP_HISTORY_NODE_URL];
const HISTORY_NODE_ACTIONS = {
  getActions: 'get_actions',
};
const HISTORY_NODE_OFFSET = 20;
const DEFAULT_CURRENCY_CODE = 'FIO';
const highestTxHeight: { [publicKey: string]: number } = {};
const HISTORY_TX_NAMES = {
  TRANSFER_PUB_KEY: 'trnsfiopubky',
  TRANSFER: 'transfer',
};

type FioHistoryNodeAction = {
  account_action_seq: number;
  block_num: number;
  block_time: string;
  action_trace: {
    receiver: string;
    act: {
      account: string;
      name: string;
      data: {
        payee_public_key?: string;
        amount?: number;
        max_fee?: number;
        actor?: string;
        tpid?: string;
        quantity?: string;
        memo?: string;
        to?: string;
        from?: string;
      };
      hex_data: string;
    };
    trx_id: string;
    block_num: number;
    block_time: string;
    producer_block_id: string;
  };
};

// Normalize date if not exists "Z" parameter
const getUTCDate = (dateString: string) => {
  const date = new Date(dateString);

  return Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  );
};

const addTx = (newTx: TransactionItemProps, txList: TransactionItemProps[]) => {
  const existingIndex = txList.findIndex(({ txId }) => txId === newTx.txId);

  if (existingIndex > -1) {
    txList[existingIndex].nativeAmount = newTx.nativeAmount;
    txList[existingIndex].networkFee = newTx.networkFee;
    txList[existingIndex].otherParams = newTx.otherParams;
    return;
  }

  txList.push(newTx);
};

const requestHistory = async (
  nodeIndex: number,
  params: {
    account_name: string;
    pos: number;
    offset: number;
  },
  uri: string,
): Promise<any> => {
  if (!HISTORY_NODE_URLS[nodeIndex]) return { error: { noNodeForIndex: true } };

  const apiUrl = HISTORY_NODE_URLS[nodeIndex];
  const result = await fetch(`${apiUrl}history/${uri || ''}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  return result.json();
};

const processTransaction = (
  publicKey: string,
  action: FioHistoryNodeAction,
  actor: string,
  transactions: TransactionItemProps[],
): number => {
  const {
    act: { name: trxName, data },
  } = action.action_trace;
  let nativeAmount;
  let actorSender;
  let networkFee = '0';
  let otherParams: {
    isTransferProcessed?: boolean;
    isFeeProcessed?: boolean;
  } = {};
  const currencyCode = DEFAULT_CURRENCY_CODE;
  const ourReceiveAddresses = [];
  if (action.block_num <= highestTxHeight[publicKey]) {
    return action.block_num;
  }
  if (
    trxName !== HISTORY_TX_NAMES.TRANSFER_PUB_KEY &&
    trxName !== HISTORY_TX_NAMES.TRANSFER
  ) {
    return action.block_num;
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
        return action.block_num;
      }
      if (otherParams.isTransferProcessed) {
        return action.block_num;
      }
      if (otherParams.isFeeProcessed) {
        nativeAmount = `${+nativeAmount - +existingTrx.networkFee}`;
        networkFee = existingTrx.networkFee;
      } else {
        console.error(
          'processTransaction error - existing spend transaction should have isTransferProcessed or isFeeProcessed set',
        );
      }
    }
    otherParams.isTransferProcessed = true;

    addTx(
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
    const fioAmount = apis.fio.amountToSUF(parseInt(amount, 10));
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
      if (+existingTrx.nativeAmount > 0) {
        return action.block_num;
      }
      if (otherParams.isFeeProcessed) {
        return action.block_num;
      }
      if (otherParams.isTransferProcessed) {
        nativeAmount = `${+existingTrx.nativeAmount - +networkFee}`;
      } else {
        console.error(
          'processTransaction error - existing spend transaction should have isTransferProcessed or isFeeProcessed set',
        );
      }
    }

    otherParams.isFeeProcessed = true;
    addTx(
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

  return action.block_num;
};

export const checkTransactions = async (
  publicKey: string,
  historyNodeIndex: number = 0,
): Promise<TransactionItemProps[]> => {
  const transactions: TransactionItemProps[] = [];
  if (!HISTORY_NODE_URLS[historyNodeIndex]) return transactions;

  let newHighestTxHeight = highestTxHeight[publicKey]; // todo: ?

  let lastActionSeqNumber = 0;
  const actor = apis.fio.publicFioSDK.transactions.getActor(publicKey);

  try {
    const lastActionObject: any = await requestHistory(
      historyNodeIndex,
      {
        account_name: actor,
        pos: -1,
        offset: -1,
      },
      HISTORY_NODE_ACTIONS.getActions,
    );

    if (lastActionObject.error && lastActionObject.error.noNodeForIndex) {
      // no more history nodes left
      return [];
    }

    if (lastActionObject.actions.length) {
      lastActionSeqNumber = lastActionObject.actions[0].account_action_seq;
    } else {
      // if no transactions at all
      return [];
    }
  } catch (e) {
    return checkTransactions(publicKey, ++historyNodeIndex);
  }

  let pos = lastActionSeqNumber;
  let finish = false;

  while (!finish) {
    if (pos < 0) {
      break;
    }
    let actionsObject;
    try {
      actionsObject = await requestHistory(
        historyNodeIndex,
        {
          account_name: actor,
          pos,
          offset: -HISTORY_NODE_OFFSET + 1,
        },
        HISTORY_NODE_ACTIONS.getActions,
      );
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

        const blockNum = processTransaction(
          publicKey,
          action,
          actor,
          transactions,
        );

        if (blockNum > newHighestTxHeight) {
          newHighestTxHeight = blockNum;
        } else if (
          (blockNum === newHighestTxHeight && i === HISTORY_NODE_OFFSET - 1) ||
          blockNum < highestTxHeight[publicKey]
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
      return checkTransactions(publicKey, ++historyNodeIndex);
    }
  }
  if (newHighestTxHeight > highestTxHeight[publicKey]) {
    highestTxHeight[publicKey] = newHighestTxHeight;
  }
  return transactions;
};
