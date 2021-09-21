import { combineReducers } from 'redux';
import { LOGIN_SUCCESS } from '../edge/actions';
import {
  LOGOUT_SUCCESS,
  PROFILE_SUCCESS,
  SIGNUP_SUCCESS,
} from '../profile/actions';
import * as actions from './actions';
import {
  FioWalletDoublet,
  FioAddressDoublet,
  FioDomainDoublet,
  LinkActionResult,
  NFTSignature,
} from '../../types';

export const emptyWallet: FioWalletDoublet = {
  id: '',
  name: '',
  publicKey: '',
  balance: null,
};

const defaultLinkState: LinkActionResult = {
  connect: { updated: [], failed: [] },
  disconnect: { updated: [], failed: [] },
};

export default combineReducers({
  loading(state: boolean = false, action) {
    switch (action.type) {
      case actions.REFRESH_BALANCE_REQUEST:
      case actions.GET_FIO_ADDRESSES_REQUEST:
      case actions.GET_FIO_DOMAINS_REQUEST:
        return true;
      case actions.REFRESH_BALANCE_SUCCESS:
      case actions.REFRESH_BALANCE_FAILURE:
      case actions.GET_FIO_ADDRESSES_SUCCESS:
      case actions.GET_FIO_ADDRESSES_FAILURE:
      case actions.GET_FIO_DOMAINS_SUCCESS:
      case actions.GET_FIO_DOMAINS_FAILURE:
        return false;
      default:
        return state;
    }
  },
  transferProcessing(state: boolean = false, action) {
    switch (action.type) {
      case actions.TRANSFER_REQUEST:
        return true;
      case actions.TRANSFER_SUCCESS:
      case actions.TRANSFER_FAILURE:
        return false;
      default:
        return state;
    }
  },
  setVisibilityProcessing(state: boolean = false, action) {
    switch (action.type) {
      case actions.SET_VISIBILITY_REQUEST:
        return true;
      case actions.SET_VISIBILITY_SUCCESS:
      case actions.SET_VISIBILITY_FAILURE:
        return false;
      default:
        return state;
    }
  },
  renewProcessing(state: boolean = false, action) {
    switch (action.type) {
      case actions.RENEW_REQUEST:
        return true;
      case actions.RENEW_SUCCESS:
      case actions.RENEW_FAILURE:
        return false;
      default:
        return state;
    }
  },
  linkProcessing(state: boolean = false, action) {
    switch (action.type) {
      case actions.LINK_TOKENS_REQUEST:
        return true;
      case actions.LINK_TOKENS_SUCCESS:
      case actions.LINK_TOKENS_FAILURE:
        return false;
      default:
        return state;
    }
  },
  fioWallets(state: FioWalletDoublet[] = [], action) {
    switch (action.type) {
      case SIGNUP_SUCCESS: {
        const fioWallets = [...state];
        for (const fioWallet of action.fioWallets) {
          fioWallets.push({
            ...emptyWallet,
            id: fioWallet.id,
            publicKey: fioWallet.publicKey,
            name: fioWallet.name,
          });
        }
        return fioWallets;
      }
      case LOGIN_SUCCESS: {
        const fioWallets = [...state];

        for (const fioWallet of action.data.fioWallets) {
          if (fioWallets.find(item => item.id === fioWallet.id)) continue;
          fioWallets.push({
            ...emptyWallet,
            id: fioWallet.id,
            publicKey: fioWallet.getDisplayPublicSeed(),
            name: fioWallet.name,
          });
        }
        return fioWallets;
      }
      case PROFILE_SUCCESS: {
        const fioWallets = [...state];

        for (const fioWallet of action.data.fioWallets) {
          if (fioWallets.find(item => item.id === fioWallet.id)) continue;
          fioWallets.push({
            ...emptyWallet,
            id: fioWallet.id,
            publicKey: fioWallet.publicKey,
            name: fioWallet.name,
          });
        }
        return fioWallets;
      }
      case actions.REFRESH_BALANCE_SUCCESS: {
        return state.map(fioWallet =>
          fioWallet.publicKey === action.publicKey
            ? {
                ...fioWallet,
                balance: action.data,
              }
            : fioWallet,
        );
      }
      case LOGOUT_SUCCESS:
        return [];
      default:
        return state;
    }
  },
  fioAddresses(state: FioAddressDoublet[] = [], action) {
    switch (action.type) {
      case actions.REFRESH_FIO_NAMES_SUCCESS:
      case actions.GET_FIO_ADDRESSES_SUCCESS: {
        const fioAddresses = [...state];
        for (const item of action.data.fio_addresses) {
          const fioAddress = {
            name: item.fio_address,
            expiration: item.expiration,
            remaining: item.remaining_bundled_tx,
            walletPublicKey: action.publicKey,
          };
          const index = fioAddresses.findIndex(
            ({ name }) => name === fioAddress.name,
          );
          if (index < 0) {
            fioAddresses.push(fioAddress);
            continue;
          }
          fioAddresses[index] = fioAddress;
        }
        return fioAddresses;
      }
      case actions.TRANSFER_SUCCESS: {
        const fioAddresses = [...state];
        const fioAddressIndex = fioAddresses.findIndex(
          ({ name }) => name === action.fioName,
        );
        if (fioAddressIndex > -1) {
          fioAddresses.splice(fioAddressIndex, 1);
        }
        return fioAddresses;
      }
      case actions.RENEW_SUCCESS: {
        const fioAddresses = [...state];
        const fioAddress = fioAddresses.find(
          ({ name }) => name === action.fioName,
        );

        if (fioAddress != null) {
          fioAddress.expiration = action.data.expiration;
          return fioAddresses;
        }

        return state;
      }
      case LOGOUT_SUCCESS:
        return [];
      default:
        return state;
    }
  },
  fioDomains(state: FioDomainDoublet[] = [], action) {
    switch (action.type) {
      case actions.REFRESH_FIO_NAMES_SUCCESS:
      case actions.GET_FIO_DOMAINS_SUCCESS: {
        const fioDomains = [...state];
        for (const item of action.data.fio_domains) {
          const fioDomain = {
            name: item.fio_domain,
            expiration: item.expiration,
            isPublic: item.is_public,
            walletPublicKey: action.publicKey,
          };
          const index = fioDomains.findIndex(
            ({ name }) => name === fioDomain.name,
          );
          if (index < 0) {
            fioDomains.push(fioDomain);
            continue;
          }
          fioDomains[index] = fioDomain;
        }
        return fioDomains;
      }
      case actions.SET_VISIBILITY_SUCCESS: {
        const fioDomains = [...state];
        const fioDomain = fioDomains.find(
          ({ name }) => name === action.fioDomain,
        );
        fioDomain.isPublic = action.isPublic;
        return fioDomains;
      }
      case actions.TRANSFER_SUCCESS: {
        const fioDomains = [...state];
        const fioDomainIndex = fioDomains.findIndex(
          ({ name }) => name === action.fioName,
        );
        if (fioDomainIndex > -1) {
          fioDomains.splice(fioDomainIndex, 1);
        }
        return fioDomains;
      }
      case actions.RENEW_SUCCESS: {
        const fioDomains = [...state];
        const fioDomain = fioDomains.find(
          ({ name }) => name === action.fioDomain,
        );
        if (fioDomain != null) {
          fioDomain.expiration = action.data.expiration;
          return fioDomains;
        }
        return state;
      }
      case LOGOUT_SUCCESS:
        return [];
      default:
        return state;
    }
  },
  hasMoreAddresses(state: { [publicKey: string]: number } = {}, action) {
    switch (action.type) {
      case actions.GET_FIO_ADDRESSES_SUCCESS:
        return { ...state, [action.publicKey]: action.data.more };
      default:
        return state;
    }
  },
  hasMoreDomains(state: { [publicKey: string]: number } = {}, action) {
    switch (action.type) {
      case actions.GET_FIO_DOMAINS_SUCCESS:
        return { ...state, [action.publicKey]: action.data.more };
      default:
        return state;
    }
  },
  fees(state: { [endpoint: string]: number } = {}, action) {
    switch (action.type) {
      case actions.GET_FEE_SUCCESS:
        return { ...state, [action.endpoint]: action.data.fee };
      default:
        return state;
    }
  },
  transactionResult(state: { [actionName: string]: any } = {}, action) {
    switch (action.type) {
      case actions.TRANSFER_REQUEST:
      case actions.RENEW_REQUEST:
      case actions.SET_VISIBILITY_REQUEST:
        return { ...state, [action.actionName]: null };
      case actions.RESET_TRANSACTION_RESULT:
        return { ...state, [action.data]: null };
      case actions.SET_VISIBILITY_SUCCESS:
      case actions.TRANSFER_SUCCESS:
      case actions.RENEW_SUCCESS:
        return { ...state, [action.actionName]: action.data };
      case actions.SET_VISIBILITY_FAILURE:
      case actions.RENEW_FAILURE:
      case actions.TRANSFER_FAILURE:
        return {
          ...state,
          [action.actionName]: { error: action.error && action.error.message },
        };
      default:
        return state;
    }
  },
  feesLoading(state: { [endpoint: string]: boolean } = {}, action) {
    switch (action.type) {
      case actions.GET_FEE_REQUEST:
        return { ...state, [action.endpoint]: true };
      case actions.GET_FEE_SUCCESS:
      case actions.GET_FEE_FAILURE:
        return { ...state, [action.endpoint]: false };
      default:
        return state;
    }
  },
  linkResults(state: LinkActionResult = defaultLinkState, action) {
    switch (action.type) {
      case actions.LINK_TOKENS_REQUEST:
        return defaultLinkState;
      case actions.LINK_TOKENS_SUCCESS:
        return action.data;
      case actions.LINK_TOKENS_FAILURE:
        return { ...defaultLinkState, error: action.data };
      default:
        return state;
    }
  },
  nftList(state: NFTSignature[] = [], action) {
    switch (action.type) {
      case actions.FIO_SIGNATURE_ADDRESS_SUCCESS:
        return [...action.data.nfts];
      default:
        return state;
    }
  },
});
