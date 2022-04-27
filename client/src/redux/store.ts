import {
  createStore,
  applyMiddleware,
  compose as simpleCompose,
  Store,
} from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { composeWithDevTools } from '@redux-devtools/extension';
import createSagaMiddleware from 'redux-saga';
import throttle from 'lodash/throttle';
import { History } from 'history';

import { loadState, saveState } from '../localStorage';

import apiMiddleware from './apiMiddleware';

import createReducer from './reducer';
import rootSaga from './sagas';

import { Api } from '../api';

export default function configureStore(api: Api, history: History): Store {
  const compose =
    process.env.NODE_ENV === 'production' ? simpleCompose : composeWithDevTools;

  const sagaMiddleware = createSagaMiddleware();

  const persistedState = loadState();

  const store = createStore(
    createReducer(history),
    persistedState,
    compose(
      applyMiddleware(
        apiMiddleware(api),
        routerMiddleware(history),
        sagaMiddleware,
      ),
    ),
  );

  store.subscribe(
    throttle(() => {
      saveState({
        cart: {
          cartItems: store.getState().cart.cartItems,
          date: store.getState().cart.date,
        },
        profile: {
          lastAuthData: store.getState().profile.lastAuthData,
          lastActivityDate: store.getState().profile.lastActivityDate,
        },
        edge: {
          hasTwoFactorAuth: store.getState().edge.hasTwoFactorAuth,
        },
        fio: {
          // we should save showTokenListInfoBadge state during session
          showTokenListInfoBadge: store.getState().fio.showTokenListInfoBadge,
        },
        fioWalletsData: {
          walletsData: store.getState().fioWalletsData.walletsData,
          walletsTxHistory: store.getState().fioWalletsData.walletsTxHistory,
        },
      });
    }, 1000),
  );

  sagaMiddleware.run(() => rootSaga(history, api));

  return store;
}
