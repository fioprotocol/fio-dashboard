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
  const setValues = (amount: number | null) => {
    return {
      nativeFio: amount,
      fio: `${amount}`,
      usdc: `${apis.fio.convertFioToUsdc(apis.fio.amountToSUF(amount), roe)}`,
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
      total.balance += walletsBalances[publicKey].total.nativeFio;
      total.available += walletsBalances[publicKey].available.nativeFio;
      total.locked += walletsBalances[publicKey].locked.nativeFio;
    }
  }
  return calculateBalances(total, roe);
};

export const DEFAULT_FEE_PRICES = setFees(0, 1);
export const DEFAULT_BALANCES = calculateBalances({}, 1);
