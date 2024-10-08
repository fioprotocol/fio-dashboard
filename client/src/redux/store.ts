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

import { loadState, saveState } from '../localStorage';

import apiMiddleware from './apiMiddleware';

import createReducer from './reducer';
import rootSaga from './sagas';

import { Api } from '../api';
import { ReduxState } from './init';
import { sentryReduxEnhancer } from '../sentry';

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
      sentryReduxEnhancer,
    ),
  );

  let currentState: ReduxState;
  store.subscribe(
    throttle(() => {
      const previousState: ReduxState = currentState;
      currentState = {
        cart: {
          cartId: store.getState().cart.cartId,
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
          showSocialMediaListInfoBadge: store.getState().fio
            .showSocialMediaListInfoBadge,
          showFchBundleWarningBagde: store.getState().fio
            .showFchBundleWarningBagde,
          showExpiredDomainWarningBadge: store.getState().fio
            .showExpiredDomainWarningBadge,
          showExpiredDomainWarningFchBadge: store.getState().fio
            .showExpiredDomainWarningFchBadge,
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

  sagaMiddleware.run(() => rootSaga(history, api));

  return store;
}
