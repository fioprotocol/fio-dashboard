import { prefix } from './actions';
import { emptyWallet } from './reducer';
import { getElementByFioName } from '../../utils';

export const loading = state => state[prefix].loading;
export const transferProcessing = state => state[prefix].transferProcessing;
export const setVisibilityProcessing = state =>
  state[prefix].setVisibilityProcessing;
export const linkProcessing = state => state[prefix].linkProcessing;
export const fioWallets = state => state[prefix].fioWallets;
export const fioAddresses = state => state[prefix].fioAddresses;
export const fioDomains = state => state[prefix].fioDomains;
export const hasMoreAddresses = state => state[prefix].hasMoreAddresses;
export const hasMoreDomains = state => state[prefix].hasMoreDomains;
export const transactionResult = state => state[prefix].transactionResult;
export const fees = state => state[prefix].fees;
export const feesLoading = state => state[prefix].feesLoading;
export const linkResults = state => state[prefix].linkResults;

export const currentWallet = (state, ownProps) => {
  // todo: set types for state & fix ownProps type
  const { fioWallets } = state.fio;
  const { fioNameList, name } = ownProps;

  const selected = getElementByFioName({ fioNameList, name });
  const walletPublicKey = (selected && selected.walletPublicKey) || '';
  // FioWalletDoublet
  const currentWallet =
    fioWallets &&
    fioWallets.find(wallet => wallet.publicKey === walletPublicKey);

  return currentWallet || emptyWallet;
};

export const walletPublicKey = (state, ownProps) => {
  const { fioNameList, name } = ownProps;
  const selected = getElementByFioName({ fioNameList, name });

  return (selected && selected.walletPublicKey) || '';
};
