import { combineReducers } from 'redux';
import isEqual from 'lodash/isEqual';
import { PublicAddress } from '@fioprotocol/fiosdk/src/entities/PublicAddress';

import { LOGIN_SUCCESS as EDGE_LOGIN_SUCCESS } from '../edge/actions';
import { ADD_WALLET_SUCCESS, UPDATE_WALLET_NAME } from '../account/actions';
import {
  LOGOUT_SUCCESS,
  PROFILE_SUCCESS,
  SIGNUP_SUCCESS,
} from '../profile/actions';
import * as actions from './actions';

import { transformNft, normalizePublicAddresses } from '../../util/fio';

import { WALLET_CREATED_FROM } from '../../constants/common';
import { FIO_CHAIN_CODE } from '../../constants/fio';

import { DEFAULT_BALANCES } from '../../util/prices';

import {
  FioWalletDoublet,
  FioAddressDoublet,
  FioDomainDoublet,
  NFTTokenDoublet,
  FeePrice,
  WalletsBalances,
  MappedPublicAddresses,
} from '../../types';

export const emptyWallet: FioWalletDoublet = {
  id: '',
  edgeId: '',
  name: '',
  publicKey: '',
  balance: null,
  available: null,
  locked: null,
  from: WALLET_CREATED_FROM.EDGE,
};

export default combineReducers({
  loading(state: boolean = false, action) {
    switch (action.type) {
      case actions.REFRESH_BALANCE_REQUEST:
      case actions.GET_FIO_ADDRESSES_REQUEST:
      case actions.GET_FIO_DOMAINS_REQUEST:
      case actions.FIO_SIGNATURE_REQUEST:
      case actions.GET_ALL_PUBLIC_ADDRESS_REQUEST:
      case actions.GET_WALLETS_FIO_ADDRESSES_REQUEST:
        return true;
      case actions.REFRESH_BALANCE_SUCCESS:
      case actions.REFRESH_BALANCE_FAILURE:
      case actions.GET_FIO_ADDRESSES_SUCCESS:
      case actions.GET_FIO_ADDRESSES_FAILURE:
      case actions.GET_FIO_DOMAINS_SUCCESS:
      case actions.GET_FIO_DOMAINS_FAILURE:
      case actions.FIO_SIGNATURE_SUCCESS:
      case actions.FIO_SIGNATURE_FAILURE:
      case actions.GET_ALL_PUBLIC_ADDRESS_SUCCESS:
      case actions.GET_ALL_PUBLIC_ADDRESS_FAILURE:
      case actions.GET_WALLETS_FIO_ADDRESSES_SUCCESS:
      case actions.GET_WALLETS_FIO_ADDRESSES_FAILURE:
        return false;
      default:
        return state;
    }
  },
  walletsFioAddressesLoading(state: boolean = false, action) {
    switch (action.type) {
      case actions.GET_WALLETS_FIO_ADDRESSES_REQUEST:
        return true;
      case actions.GET_WALLETS_FIO_ADDRESSES_SUCCESS:
      case actions.GET_WALLETS_FIO_ADDRESSES_FAILURE:
        return false;
      default:
        return state;
    }
  },
  fioWalletsBalances(
    state: WalletsBalances = { total: DEFAULT_BALANCES, wallets: {} },
    action,
  ) {
    switch (action.type) {
      case actions.SET_BALANCES: {
        return action.data;
      }
      case LOGOUT_SUCCESS: {
        return { total: DEFAULT_BALANCES, wallets: {} };
      }
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
        return fioWallets.sort(({ id: id1 }, { id: id2 }) =>
          id1 > id2 ? 1 : -1,
        );
      }
      case EDGE_LOGIN_SUCCESS: {
        const fioWallets: FioWalletDoublet[] = [];

        for (const fioWallet of action.data.fioWallets) {
          if (
            fioWallets.find(
              item =>
                item.publicKey === fioWallet.publicWalletInfo.keys.publicKey,
            )
          )
            continue;
          fioWallets.push({
            ...emptyWallet,
            edgeId: fioWallet.id,
            publicKey: fioWallet.publicWalletInfo.keys.publicKey,
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
        return fioWallets.sort(({ id: id1 }, { id: id2 }) =>
          id1 > id2 ? 1 : -1,
        );
      }
      case actions.REFRESH_BALANCE_SUCCESS: {
        return state.map(fioWallet => {
          if (fioWallet.publicKey === action.publicKey) {
            fioWallet.balance = action.data.balance;
            fioWallet.available = action.data.available;
            fioWallet.locked = action.data.locked;
            fioWallet.staked = action.data.staked;
            fioWallet.rewards = action.data.rewards;
          }
          return fioWallet;
        });
      }
      case ADD_WALLET_SUCCESS: {
        const fioWallets = [...state];
        if (
          !fioWallets.find(item => item.publicKey === action.data.publicKey)
        ) {
          fioWallets.push({ ...emptyWallet, ...action.data });
        }
        return fioWallets;
      }
      case UPDATE_WALLET_NAME:
        return state.map(fioWallet => {
          if (fioWallet.publicKey === action.data.publicKey) {
            fioWallet.name = action.data.name;
          }
          return fioWallet;
        });
      case LOGOUT_SUCCESS:
        return [];
      default:
        return state;
    }
  },
  fioWalletsIdKeys(state: { id: string; publicKey: string }[] = [], action) {
    switch (action.type) {
      case SIGNUP_SUCCESS: {
        const fioWallets = [];
        for (const { id, publicKey } of action.fioWallets) {
          fioWallets.push({
            id,
            publicKey,
          });
        }
        return fioWallets;
      }
      case PROFILE_SUCCESS: {
        return action.data.fioWallets.map(
          ({ id, publicKey }: FioWalletDoublet) => ({
            id,
            publicKey,
          }),
        );
      }
      case ADD_WALLET_SUCCESS: {
        const fioWallets = [...state];
        if (
          !fioWallets.find(item => item.publicKey === action.data.publicKey)
        ) {
          fioWallets.push({
            id: action.data.id,
            publicKey: action.data.publicKey,
          });
        }
        return fioWallets;
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
      case actions.GET_WALLETS_FIO_ADDRESSES_SUCCESS:
      case actions.GET_FIO_ADDRESSES_SUCCESS: {
        const fioAddresses = [...state];
        for (const item of action.data.fio_addresses) {
          const fioAddress = {
            name: item.fio_address,
            expiration: item.expiration,
            remaining: item.remaining_bundled_tx,
            walletPublicKey: item.publicKey || action.publicKey,
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
      case LOGOUT_SUCCESS:
        return {};
      default:
        return state;
    }
  },
  hasMoreDomains(state: { [publicKey: string]: number } = {}, action) {
    switch (action.type) {
      case actions.GET_FIO_DOMAINS_SUCCESS:
        return { ...state, [action.publicKey]: action.data.more };
      case LOGOUT_SUCCESS:
        return {};
      default:
        return state;
    }
  },
  mappedPublicAddresses(state: MappedPublicAddresses = {}, action) {
    switch (action.type) {
      case actions.GET_ALL_PUBLIC_ADDRESS_SUCCESS: {
        const currentFioAddress = state[action.fioAddress];

        const { publicAddresses: currentPubAddress } = currentFioAddress || {};
        const publicAddresses = currentPubAddress ? [...currentPubAddress] : [];
        for (const item of action.data.public_addresses.filter(
          (pubAddress: PublicAddress) =>
            pubAddress.chain_code.toUpperCase() !== FIO_CHAIN_CODE,
        )) {
          const itemPublicAddress = {
            chainCode: item.chain_code,
            tokenCode: item.token_code,
            publicAddress: item.public_address,
          };

          const index = publicAddresses.findIndex(
            publicAddress =>
              publicAddress.chainCode === itemPublicAddress.chainCode &&
              publicAddress.tokenCode === itemPublicAddress.tokenCode,
          );

          if (index > -1) {
            publicAddresses[index] = itemPublicAddress;
            continue;
          }

          publicAddresses.push(itemPublicAddress);
        }
        return {
          ...state,
          [action.fioAddress]: {
            publicAddresses,
            more: action.data.more,
          },
        };
      }
      case actions.UPDATE_PUBLIC_ADDRESSES: {
        const currentFioAddress = state[action.fioAddress];
        if (!currentFioAddress) return state;

        const { publicAddresses: currentPubAddress } = currentFioAddress || {};
        const publicAddresses = currentPubAddress ? [...currentPubAddress] : [];

        const {
          addPublicAddresses,
          deletePublicAddresses,
        } = action.updPublicAddresses;

        for (const itemPublicAddress of normalizePublicAddresses(
          addPublicAddresses,
        )) {
          const index = publicAddresses.findIndex(publicAddress =>
            isEqual(publicAddress, itemPublicAddress),
          );
          if (index < 0) {
            publicAddresses.push(itemPublicAddress);
            continue;
          }
          publicAddresses[index] = itemPublicAddress;
        }

        for (const itemPublicAddress of normalizePublicAddresses(
          deletePublicAddresses,
        )) {
          const index = publicAddresses.findIndex(publicAddress =>
            isEqual(publicAddress, itemPublicAddress),
          );

          if (index > -1) {
            publicAddresses.splice(index, 1);
            continue;
          }
          publicAddresses[index] = itemPublicAddress;
        }

        return {
          ...state,
          [action.fioAddress]: {
            ...currentFioAddress,
            publicAddresses,
          },
        };
      }
      case LOGOUT_SUCCESS:
        return {};
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
  showTokenListInfoBadge(state: boolean = true, action) {
    switch (action.type) {
      case actions.TOGGLE_TOKEN_LIST_INFO_BADGE: {
        return action.enabled;
      }
      case LOGOUT_SUCCESS:
        return true;
      default:
        return state;
    }
  },
  fioNamesInitRefreshed(state: { [publicKey: string]: boolean } = {}, action) {
    switch (action.type) {
      case actions.REFRESH_FIO_NAMES_SUCCESS:
      case actions.REFRESH_FIO_NAMES_FAILURE: {
        return { ...state, [action.publicKey]: true };
      }
      case LOGOUT_SUCCESS:
        return {};
      default:
        return state;
    }
  },
});
