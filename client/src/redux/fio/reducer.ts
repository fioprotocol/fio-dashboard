import { combineReducers } from 'redux';
import { LOGIN_SUCCESS as EDGE_LOGIN_SUCCESS } from '../edge/actions';
import {
  LOGOUT_SUCCESS,
  PROFILE_SUCCESS,
  SIGNUP_SUCCESS,
} from '../profile/actions';
import * as actions from './actions';
import { WALLET_CREATED_FROM } from '../../constants/common';
import {
  FioWalletDoublet,
  FioAddressDoublet,
  FioDomainDoublet,
  LinkActionResult,
  NFTTokenDoublet,
  FeePrice,
} from '../../types';

import { transformNft } from '../../util/fio';

export const emptyWallet: FioWalletDoublet = {
  id: '',
  edgeId: '',
  name: '',
  publicKey: '',
  balance: null,
  from: WALLET_CREATED_FROM.EDGE,
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
      case actions.FIO_SIGNATURE_REQUEST:
        return true;
      case actions.REFRESH_BALANCE_SUCCESS:
      case actions.REFRESH_BALANCE_FAILURE:
      case actions.GET_FIO_ADDRESSES_SUCCESS:
      case actions.GET_FIO_ADDRESSES_FAILURE:
      case actions.GET_FIO_DOMAINS_SUCCESS:
      case actions.GET_FIO_DOMAINS_FAILURE:
      case actions.FIO_SIGNATURE_SUCCESS:
      case actions.FIO_SIGNATURE_FAILURE:
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
        const fioWallets = [];
        for (const fioWallet of action.fioWallets) {
          fioWallets.push({
            ...emptyWallet,
            ...fioWallet,
          });
        }
        return fioWallets;
      }
      case EDGE_LOGIN_SUCCESS: {
        const fioWallets: FioWalletDoublet[] = [];

        for (const fioWallet of action.data.fioWallets) {
          if (fioWallets.find(item => item.publicKey === fioWallet.publicKey))
            continue;
          fioWallets.push({
            ...emptyWallet,
            edgeId: fioWallet.id,
            publicKey: fioWallet.getDisplayPublicSeed(),
            name: fioWallet.name,
          });
        }
        return fioWallets;
      }
      case PROFILE_SUCCESS: {
        const fioWallets: FioWalletDoublet[] = [];
        const existingList = [...state];

        for (const fioWallet of action.data.fioWallets) {
          const existingWallet = existingList.find(
            item => item.publicKey === fioWallet.publicKey,
          );
          fioWallets.push(
            existingWallet
              ? {
                  ...existingWallet,
                  ...fioWallet,
                }
              : {
                  ...emptyWallet,
                  ...fioWallet,
                },
          );
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
      case actions.RESET_FIO_NAMES: {
        return [];
      }
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
      case LOGOUT_SUCCESS:
        return [];
      default:
        return state;
    }
  },
  fioDomains(state: FioDomainDoublet[] = [], action) {
    switch (action.type) {
      case actions.RESET_FIO_NAMES: {
        return [];
      }
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
  fees(state: { [endpoint: string]: FeePrice } = {}, action) {
    switch (action.type) {
      case actions.SET_FEE:
        return { ...state, ...action.data };
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
  nftList(state: NFTTokenDoublet[] = [], action) {
    switch (action.type) {
      case actions.FIO_SIGNATURE_SUCCESS: {
        return transformNft(action.data.nfts);
      }
      case LOGOUT_SUCCESS:
      case actions.CLEAR_NFT_SIGNATURES:
        return [];
      default:
        return state;
    }
  },
});
