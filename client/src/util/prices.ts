import MathOp from '../util/math';

import { FeePrice, FioBalanceRes, WalletBalances } from '../types';
import apis from '../api';

export const setFees = (nativeFee: number, roe: number): FeePrice => {
  const fee: FeePrice = {
    nativeFio: null,
    costFio: null,
    costUsdc: null,
  };
  fee.nativeFio = nativeFee;
  fee.costFio = apis.fio.sufToAmount(fee.nativeFio);
  if (fee.nativeFio && roe) {
    fee.costUsdc = apis.fio.convertFioToUsdc(fee.nativeFio, roe);
  }

  return fee;
};

export const calculateBalances = (
  { balance, available, locked }: FioBalanceRes,
  roe: number,
): WalletBalances => {
  const setValues = (nativeFio: number | null) => {
    const fioAmount = apis.fio.sufToAmount(nativeFio);
    return {
      nativeFio,
      fio: `${fioAmount != null ? fioAmount.toFixed(2) : fioAmount}`,
      usdc: `${
        nativeFio != null ? apis.fio.convertFioToUsdc(nativeFio, roe) : 0
      }`,
    };
  };

  return {
    total: setValues(balance),
    available: setValues(available),
    locked: setValues(locked),
  };
};

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

export const DEFAULT_FEE_PRICES = setFees(0, 1);
export const DEFAULT_BALANCES = calculateBalances({}, 1);
