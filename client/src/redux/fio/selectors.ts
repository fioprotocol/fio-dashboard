import { prefix } from './actions';
import { emptyWallet } from './reducer';
import { getElementByFioName } from '../../utils';
import { FioNameItemProps, FioWalletDoublet, ReduxState } from '../../types';

export const loading = (state: ReduxState) => state[prefix].loading;
export const transferProcessing = (state: ReduxState) =>
  state[prefix].transferProcessing;
export const setVisibilityProcessing = (state: ReduxState) =>
  state[prefix].setVisibilityProcessing;
export const renewProcessing = (state: ReduxState) =>
  state[prefix].renewProcessing;
export const linkProcessing = (state: ReduxState) =>
  state[prefix].linkProcessing;
export const fioWallets = (state: ReduxState) => state[prefix].fioWallets;
export const fioAddresses = (state: ReduxState) => state[prefix].fioAddresses;
export const fioDomains = (state: ReduxState) => state[prefix].fioDomains;
export const hasMoreAddresses = (state: ReduxState) =>
  state[prefix].hasMoreAddresses;
export const hasMoreDomains = (state: ReduxState) =>
  state[prefix].hasMoreDomains;
export const transactionResult = (state: ReduxState) =>
  state[prefix].transactionResult;
export const fees = (state: ReduxState) => state[prefix].fees;
export const feesLoading = (state: ReduxState) => state[prefix].feesLoading;
export const linkResults = (state: ReduxState) => state[prefix].linkResults;

export const currentWallet = (
  state: ReduxState,
  ownProps: {
    fioNameList: FioNameItemProps[];
    name: string;
  } & any,
) => {
  // todo: set types for state & fix ownProps type
  const { fioWallets } = state.fio;
  const { fioNameList, name } = ownProps;

  const selected = getElementByFioName({ fioNameList, name });
  const walletPublicKey = (selected && selected.walletPublicKey) || '';
  // FioWalletDoublet
  const currentWallet: FioWalletDoublet =
    fioWallets &&
    fioWallets.find(
      (wallet: FioWalletDoublet) => wallet.publicKey === walletPublicKey,
    );

  return currentWallet || emptyWallet;
};

export const walletPublicKey = (
  state: ReduxState,
  ownProps: {
    fioNameList: FioNameItemProps[];
    name: string;
  } & any,
) => {
  const { fioNameList, name } = ownProps;
  const selected = getElementByFioName({ fioNameList, name });

  return (selected && selected.walletPublicKey) || '';
};
