import { combineReducers } from 'redux';
import { LOGIN_SUCCESS } from '../edge/actions';
import {
  LOGOUT_SUCCESS,
  PROFILE_SUCCESS,
  SIGNUP_SUCCESS,
} from '../profile/actions';
import * as actions from './actions';

const emptyWallet = {
  id: '',
  name: '',
  publicKey: '',
  balance: null,
};

export default combineReducers({
  loading(state = false, action) {
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
  fioWallets(state = [], action) {
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
  fioAddresses(state = [], action) {
    switch (action.type) {
      case actions.REFRESH_FIO_NAMES_SUCCESS:
      case actions.GET_FIO_ADDRESSES_SUCCESS: {
        const fioAddresses = [...state];
        for (const item of action.data.fio_addresses) {
          const fioAddress = {
            name: item.fio_address,
            expiration: item.expiration,
            remaining: item.remaining_bundled_tx,
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
  fioDomains(state = [], action) {
    switch (action.type) {
      case actions.REFRESH_FIO_NAMES_SUCCESS:
      case actions.GET_FIO_DOMAINS_SUCCESS: {
        const fioDomains = [...state];
        for (const item of action.data.fio_domains) {
          const fioDomain = {
            name: item.fio_domain,
            expiration: item.expiration,
            isPublic: item.is_public,
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
  hasMoreAddresses(state = {}, action) {
    switch (action.type) {
      case actions.GET_FIO_ADDRESSES_SUCCESS:
        return { ...state, [action.publicKey]: action.data.more };
      default:
        return state;
    }
  },
  hasMoreDomains(state = {}, action) {
    switch (action.type) {
      case actions.GET_FIO_DOMAINS_SUCCESS:
        return { ...state, [action.publicKey]: action.data.more };
      default:
        return state;
    }
  },
});
