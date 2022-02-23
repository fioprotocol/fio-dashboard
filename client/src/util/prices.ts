import MathOp from '../util/math';
import apis from '../api';

import { FioBalanceRes, WalletBalances, WalletBalancesItem } from '../types';

export function convertFioPrices(
  nativeFio: number | null,
  roe: number,
): WalletBalancesItem {
  const fioAmount = apis.fio.sufToAmount(nativeFio);

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
  { balance, available, locked }: FioBalanceRes,
  roe: number,
): WalletBalances => ({
  total: convertFioPrices(balance, roe),
  available: convertFioPrices(available, roe),
  locked: convertFioPrices(locked, roe),
});

export const calculateTotalBalances = (
  walletsBalances: { [publicKey: string]: WalletBalances },
  roe: number,
) => {
  const total: FioBalanceRes = {
    balance: 0,
    available: 0,
    locked: 0,
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
    }
  }
  return calculateBalances(total, roe);
};

export const DEFAULT_FEE_PRICES = convertFioPrices(0, 1);
export const DEFAULT_BALANCES = calculateBalances({}, 1);
