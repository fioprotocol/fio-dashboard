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
import isEqual from 'lodash/isEqual';
import { History } from 'history';

import { loadState, parseState, saveState } from '../localStorage';
import { setCartItems } from './cart/actions';

import apiMiddleware from './apiMiddleware';

import createReducer from './reducer';
import rootSaga from './sagas';

import { Api } from '../api';
import { ReduxState } from './init';

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

  let currentState: ReduxState;
  store.subscribe(
    throttle(() => {
      const previousState: ReduxState = currentState;
      currentState = {
        cart: {
          cartItems: store.getState().cart.cartItems,
          date: store.getState().cart.date,
          oldCart: store.getState().cart.oldCart,
        },
        profile: {
          lastAuthData: store.getState().profile.lastAuthData,
          lastActivityDate: store.getState().profile.lastActivityDate,
          isNewUser: store.getState().profile.isNewUser,
        },
        edge: {
          hasTwoFactorAuth: store.getState().edge.hasTwoFactorAuth,
          isPinEnabled: store.getState().edge.isPinEnabled,
        },
        fio: {
          // we should save showTokenListInfoBadge state during session
          showTokenListInfoBadge: store.getState().fio.showTokenListInfoBadge,
        },
        fioWalletsData: {
          walletsData: store.getState().fioWalletsData.walletsData,
          walletsTxHistory: store.getState().fioWalletsData.walletsTxHistory,
        },
      };

      if (!isEqual(previousState, currentState)) {
        saveState(currentState);
      }
    }, 1000),
  );
  window.addEventListener('storage', event => {
    if (event.key === 'state') {
      const oldCartItems = parseState(event.oldValue)?.cart?.cartItems;
      const newCartItems = parseState(event.newValue)?.cart?.cartItems;
      if (!isEqual(oldCartItems, newCartItems)) {
        store.dispatch(setCartItems(newCartItems));
      }
    }
  });

  sagaMiddleware.run(() => rootSaga(history, api));

  return store;
}
