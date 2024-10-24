import { FIOSDK } from '@fioprotocol/fiosdk';

import MathOp from '../util/math';
import apis from '../api';

import { AdditionalAction } from '../constants/fio';

import {
  FioBalanceRes,
  OrderDetailedTotalCost,
  WalletBalances,
  WalletBalancesItem,
} from '../types';

export function convertFioPrices(
  nativeFio: number | null | undefined,
  roe: number,
): WalletBalancesItem {
  const fioAmount = FIOSDK.SUFToAmount(nativeFio || 0);

  return {
    nativeFio,
    fio: `${fioAmount != null ? fioAmount.toFixed(2) : fioAmount}`,
    usdc: `${
      nativeFio != null && roe != null
        ? apis.fio.convertFioToUsdc(nativeFio, roe)
        : 0
    }`,
  };
}

export const calculateBalances = (
  {
    balance = 0,
    available = 0,
    locked = 0,
    staked = 0,
    rewards = 0,
    unlockPeriods = [],
  }: FioBalanceRes,
  roe: number,
): WalletBalances => ({
  total: convertFioPrices(balance, roe),
  available: convertFioPrices(available, roe),
  staked: convertFioPrices(staked, roe),
  locked: convertFioPrices(locked, roe),
  rewards: convertFioPrices(rewards, roe),
  unlockPeriods: unlockPeriods.map(({ amount, date }) => ({
    date: date ? new Date(date) : null,
    ...convertFioPrices(amount, roe),
  })),
});

export const calculateTotalBalances = (
  walletsBalances: { [publicKey: string]: WalletBalances },
  roe: number,
): WalletBalances => {
  const total: FioBalanceRes = {
    balance: 0,
    available: 0,
    locked: 0,
    staked: 0,
    rewards: 0,
    unlockPeriods: [],
  };
  for (const publicKey in walletsBalances) {
    if (walletsBalances[publicKey] != null) {
      total.balance = new MathOp(total.balance)
        .add(walletsBalances[publicKey].total.nativeFio)
        .toNumber();
      total.available = new MathOp(total.available)
        .add(walletsBalances[publicKey].available.nativeFio)
        .toNumber();
      total.locked = new MathOp(total.locked)
        .add(walletsBalances[publicKey].locked.nativeFio)
        .toNumber();
      total.staked = new MathOp(total.staked)
        .add(walletsBalances[publicKey].staked.nativeFio)
        .toNumber();
      total.rewards = new MathOp(total.rewards)
        .add(walletsBalances[publicKey].rewards.nativeFio)
        .toNumber();
      total.unlockPeriods = [
        ...(total.unlockPeriods || []),
        ...(walletsBalances[publicKey].unlockPeriods?.map(
          ({ nativeFio, date }) => ({
            amount: nativeFio,
            date: date.getTime(),
          }),
        ) || []),
      ].sort(({ date: dateA }, { date: dateB }) =>
        dateA && dateB && dateA > dateB ? 1 : -1,
      );
    }
  }

  return calculateBalances(total, roe);
};

export const DEFAULT_FEE_PRICES = convertFioPrices(0, 1);
export const DEFAULT_BALANCES = calculateBalances({}, 1);

export const DEFAULT_ORACLE_FEE_PRICES = {
  [AdditionalAction.wrapFioDomain]:
    process.env.REACT_APP_DEFAULT_WRAP_DOMAIN_ORACLE_FEES,
  [AdditionalAction.wrapFioTokens]:
    process.env.REACT_APP_DEFAULT_WRAP_TOKEN_ORACLE_FEES,
};

export const getDefaultOracleFeePrices = ({
  roe,
  action,
}: {
  roe?: number;
  action: AdditionalAction.wrapFioDomain | AdditionalAction.wrapFioTokens;
}) =>
  convertFioPrices(
    DEFAULT_ORACLE_FEE_PRICES[action]
      ? Number(DEFAULT_ORACLE_FEE_PRICES[action])
      : 0,
    roe || 1,
  );

export const combinePriceWithDivider = ({
  totalCostPrice,
}: {
  totalCostPrice: OrderDetailedTotalCost;
}) => {
  const { freeTotalPrice, fioTotalPrice, usdcTotalPrice } =
    totalCostPrice || {};

  if (freeTotalPrice) return freeTotalPrice;
  if (!fioTotalPrice && !usdcTotalPrice) return 'N/A';

  return `${usdcTotalPrice} (${fioTotalPrice})`;
};
