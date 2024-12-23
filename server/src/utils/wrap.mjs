import { WRAP_STATUS_NETWORKS } from '../config/constants';
import { convertToNewDate } from './general.mjs';

const DEFAULT_ORACLE_APPROVAL_COUNT = 3;
const WRAP_ITEM_STATUS = {
  PENDING: 'Pending',
  FAILED: 'Failed',
  COMPLETE: 'Complete',
};

const parseActionStatus = ({ blockTimestamp, isComplete }) => {
  const TRANSACTION_OUT_OF_TIME_MILLISECONDS = 10 * 60 * 1000; // 10 minutes - time delay which proves that transaction wasn't completed successfully (oracle - 1m, wrap_status job - 1m, else - chains requests)

  let status;
  const isTransactionIsOutOfTime = date => {
    if (!date) return true;
    return (
      new Date().getTime() - new Date(date).getTime() >=
      TRANSACTION_OUT_OF_TIME_MILLISECONDS
    );
  };

  if (isComplete) {
    status = WRAP_ITEM_STATUS.COMPLETE;
  } else {
    if (isTransactionIsOutOfTime(blockTimestamp)) {
      status = WRAP_ITEM_STATUS.FAILED;
    } else {
      status = WRAP_ITEM_STATUS.PENDING;
    }
  }

  return status;
};

export const normalizeWrapData = wrapItem => {
  const {
    address,
    amount,
    blockNumber,
    confirmData,
    data,
    domain,
    oravotes,
    oracleId,
    transactionId,
  } = wrapItem;

  const {
    act: { data: { actor, chain_code, tpid } = {}, name: actionType } = {},
    receiver: escrowAccount,
    timestamp,
  } = data || {};

  const approvals = {},
    voters = [];

  const { blockNumber: confirmBlockNumber, blockTimeStamp, transactionHash } =
    confirmData || {};

  const isComplete =
    confirmData &&
    (!Object.keys(confirmData).includes('isComplete') || !!data.confirmData.isComplete);

  const status = parseActionStatus({ blockTimestamp: timestamp + 'Z', isComplete });

  if (confirmBlockNumber) {
    approvals.blockNumber = confirmBlockNumber;
  }
  if (blockTimeStamp) {
    approvals.blockTimeStamp = blockTimeStamp ? convertToNewDate(blockTimeStamp) : null;
  }
  if (transactionHash) {
    approvals.txId = transactionHash;
  }
  if (chain_code) {
    approvals.chainCode =
      chain_code === WRAP_STATUS_NETWORKS.MATIC || chain_code === WRAP_STATUS_NETWORKS.POL
        ? WRAP_STATUS_NETWORKS.POLYGON
        : chain_code;
  }

  if (oravotes && oravotes.length)
    for (const oracleVoter of oravotes) {
      const { returnValues: { account, obtid } = {}, transactionHash } = oracleVoter;
      voters.push({ account, transactionHash, obtid });
    }

  return {
    actionType,
    amount,
    approvals,
    blockNumber,
    blockTimestamp: timestamp + 'Z',
    chain: WRAP_STATUS_NETWORKS.FIO,
    domain,
    escrowAccount,
    from: actor,
    oracleId,
    status,
    to: address,
    tpid,
    voters,
    transactionId,
  };
};

export const normalizeUnwrapData = unwrapItem => {
  const {
    address,
    amount,
    blockNumber,
    confirmData,
    data,
    domain,
    fioAddress,
    oravotes,
    transactionHash,
  } = unwrapItem;

  const { blockTimeStamp } = data || {};

  const approvals = {
    chainCode: WRAP_STATUS_NETWORKS.FIO,
    blockTimeStamp: null,
    txIds: [],
  };

  if (oravotes && oravotes.length) {
    const { voters, isComplete } = oravotes[0];
    if (voters) {
      approvals.voters = voters;
    }
    if (JSON.stringify(isComplete)) {
      approvals.isComplete = Boolean(
        isComplete && voters && voters.length === DEFAULT_ORACLE_APPROVAL_COUNT,
      );
    }
  }

  if (confirmData) {
    for (const confirmDataItem of confirmData) {
      const { trx_id, timestamp } = confirmDataItem;

      if (!approvals.blockTimeStamp) {
        approvals.blockTimeStamp = timestamp + 'Z';
      } else {
        const blockTime = new Date(timestamp + 'Z');
        const approvalsBlockTime = new Date(approvals.blockTimeStamp);

        if (blockTime > approvalsBlockTime) {
          approvals.blockTimeStamp = blockTime;
        }
      }

      if (trx_id) approvals.txIds.push(trx_id);
    }
  }

  const status = parseActionStatus({
    blockTimestamp: approvals.blockTimeStamp,
    isComplete: approvals.isComplete,
  });

  const blockTimestampDate = blockTimeStamp ? convertToNewDate(blockTimeStamp) : null;

  return {
    amount,
    approvals,
    blockNumber,
    blockTimestamp: blockTimestampDate ? blockTimestampDate : null,
    chain: amount
      ? WRAP_STATUS_NETWORKS.ETH
      : domain
      ? WRAP_STATUS_NETWORKS.POLYGON
      : 'N/A',
    domain,
    from: address,
    status,
    to: fioAddress,
    transactionId: transactionHash,
  };
};

export const normalizeBurnData = burnDomainItem => {
  const {
    blockNumber,
    confirmData,
    data,
    domain,
    oravotes,
    transactionId,
  } = burnDomainItem;

  const { timestamp } = data || {};

  const approvals = {
      chainCode: WRAP_STATUS_NETWORKS.POLYGON,
    },
    voters = [];

  const { blockNumber: confirmBlockNumber, blockTimeStamp, transactionHash } =
    confirmData || {};

  const isComplete =
    confirmData &&
    (!Object.keys(confirmData).includes('isComplete') || !!data.confirmData.isComplete);

  const status = parseActionStatus({
    blockTimestamp: timestamp + 'Z',
    isComplete,
  });

  if (confirmBlockNumber) {
    approvals.blockNumber = confirmBlockNumber;
  }
  if (blockTimeStamp) {
    approvals.blockTimeStamp = blockTimeStamp ? convertToNewDate(blockTimeStamp) : null;
  }
  if (transactionHash) {
    approvals.txId = transactionHash;
  }

  if (oravotes && oravotes.length)
    for (const oracleVoter of oravotes) {
      const { returnValues: { account, obtid } = {}, transactionHash } = oracleVoter;
      voters.push({ account, transactionHash, obtid });
    }

  return {
    actionType: 'burnexpired',
    approvals,
    blockNumber,
    blockTimestamp: timestamp + 'Z',
    chain: WRAP_STATUS_NETWORKS.FIO,
    domain,
    status,
    transactionId,
    voters,
  };
};

export const filterWrapItemsByDateRange = ({
  createdAt,
  dateRange,
  normalizedWrapItemsData,
}) => {
  if (createdAt) {
    const filteredUnwrapList = normalizedWrapItemsData.filter(
      unwrapItem => new Date(unwrapItem.blockTimestamp) > new Date(createdAt),
    );
    return filteredUnwrapList || [];
  }
  if (dateRange && dateRange.startDate && dateRange.endDate) {
    const filteredUnwrapList = normalizedWrapItemsData.filter(
      unwrapItem =>
        new Date(unwrapItem.blockTimestamp) > new Date(dateRange.startDate) &&
        new Date(unwrapItem.blockTimestamp) < new Date(dateRange.endDate),
    );
    return filteredUnwrapList || [];
  }

  return [];
};
