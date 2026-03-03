import { Account } from '@fioprotocol/fiosdk';

import apis from '../api';

import { FIO_CHAIN_CODE, WALLET_HISTORY_NODE_LIMIT } from '../constants/fio';

import MathOp from './math';
import { getUTCDate, log } from './general';
import config from '../config';
import { renderFioPriceFromSuf } from './fio';

import { TransactionItemProps } from '../types';
import { TransactionDetailsProps } from '../components/TransactionDetails/TransactionDetails';
import { HandleTransactionDetailsProps } from '../types/transactions';
import { FioHistoryV2NodeAction } from '../types/fio';

const HISTORY_TX_NAMES = {
  TRANSFER_PUB_KEY: 'trnsfiopubky',
  TRANSFER: 'transfer',
};

const updateTx = (
  newTx: TransactionItemProps,
  txList: TransactionItemProps[],
): TransactionItemProps[] => {
  const existingIndex = txList.findIndex(({ txId }) => txId === newTx.txId);

  if (existingIndex > -1) {
    txList[existingIndex].nativeAmount = newTx.nativeAmount;
    txList[existingIndex].networkFee = newTx.networkFee;
    txList[existingIndex].otherParams = newTx.otherParams;
    if (!txList[existingIndex].timestamp) {
      txList[existingIndex].timestamp = newTx.timestamp;
    }
    return txList;
  }

  txList.push(newTx);

  return txList;
};

const processTransaction = ({
  publicKey,
  action,
  actor,
  transactions,
}: {
  publicKey: string;
  action: FioHistoryV2NodeAction;
  actor: string;
  transactions: TransactionItemProps[];
}): { transformedTransactions: TransactionItemProps[] } => {
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
  const currencyCode = FIO_CHAIN_CODE;
  const ourReceiveAddresses = [];
  let transformedTransactions: TransactionItemProps[] = [];

  if (
    trxName !== HISTORY_TX_NAMES.TRANSFER_PUB_KEY &&
    trxName !== HISTORY_TX_NAMES.TRANSFER
  ) {
    return { transformedTransactions: transactions };
  }

  // Transfer funds transaction
  if (trxName === HISTORY_TX_NAMES.TRANSFER_PUB_KEY && data.amount != null) {
    nativeAmount = data.amount.toString();
    const amount = renderFioPriceFromSuf(nativeAmount);
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
      if (new MathOp(nativeAmount).gt(0)) {
        return { transformedTransactions: transactions };
      }
      if (otherParams.isTransferProcessed) {
        return { transformedTransactions: transactions };
      }
      if (otherParams.isFeeProcessed) {
        nativeAmount = new MathOp(nativeAmount)
          .sub(existingTrx.networkFee)
          .toString();
        networkFee = existingTrx.networkFee;
      } else {
        log.error(
          'processTransaction error - existing spend transaction should have isTransferProcessed or isFeeProcessed set',
        );
      }
    }
    otherParams.isTransferProcessed = true;

    transformedTransactions = updateTx(
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
    const fioAmount = apis.fio.amountToSUF(data.amount);
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
        new MathOp(existingTrx.nativeAmount).gt(0) &&
        otherParams?.feeActors?.includes(data?.to)
      ) {
        return { transformedTransactions: transactions };
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
          return { transformedTransactions: transactions };
        }
      }
      if (otherParams?.isTransferProcessed) {
        nativeAmount = new MathOp(existingTrx.nativeAmount)
          .sub(networkFee)
          .toString();
      } else if (!otherParams.isFeeProcessed) {
        log.error(
          'processTransaction error - existing spend transaction should have isTransferProcessed or isFeeProcessed set',
        );
      }
    }

    otherParams.isFeeProcessed = true;
    transformedTransactions = updateTx(
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
    transformedTransactions,
  };
};

export const fetchTransactionActions = async ({
  publicKey,
  params,
  fioHistoryUrls,
}: {
  publicKey: string;
  params: {
    before?: string | null;
  };
  fioHistoryUrls: string[];
}): Promise<{ actions: FioHistoryV2NodeAction[]; hasNextPage: boolean }> => {
  const actor = apis.fio.publicFioSDK.transactions.getActor(publicKey);

  const actionParams = {
    account: actor,
    limit: WALLET_HISTORY_NODE_LIMIT,
    'act.account': Account.token,
    ...(params.before ? { before: params.before } : {}),
  };

  for (const apiUrl of fioHistoryUrls) {
    try {
      const actionsObject = await apis.fioHistory.getHistoryV2Actions({
        apiUrl,
        params: { ...actionParams },
      });

      const actions: FioHistoryV2NodeAction[] = actionsObject.actions || [];
      const hasNextPage = actions.length >= WALLET_HISTORY_NODE_LIMIT;

      return { actions, hasNextPage };
    } catch (e) {
      log.error('History request error. ', e);
    }
  }

  return { actions: [], hasNextPage: false };
};

export const transformActions = ({
  actions,
  publicKey,
}: {
  actions: FioHistoryV2NodeAction[];
  publicKey: string;
}): TransactionItemProps[] => {
  const actor = apis.fio.publicFioSDK.transactions.getActor(publicKey);
  const transactions: TransactionItemProps[] = [];

  for (const action of actions) {
    processTransaction({ publicKey, action, actor, transactions });
  }

  return transactions.sort((tx1, tx2) => (tx1.date < tx2.date ? 1 : -1));
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
        fio: apis.fio.sufToAmount(fioWallet?.balance),
        usdc: apis.fio.convertFioToUsdc(fioWallet?.balance, roe),
      },
    };
  }

  if (feeCollected) {
    transactionDetails.feeInFio = new MathOp(feeCollected).toString();

    const walletBalance = shouldSubFeesFromBalance
      ? new MathOp(fioWallet?.balance).sub(feeCollected).toString()
      : fioWallet?.balance;

    transactionDetails.payWith.walletBalances = {
      nativeFio: walletBalance,
      fio: apis.fio.sufToAmount(walletBalance),
      usdc: apis.fio.convertFioToUsdc(walletBalance, roe),
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
