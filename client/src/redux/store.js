import { createStore, applyMiddleware, compose as simpleCompose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import throttle from 'lodash/throttle';
import { loadState, saveState } from '../localStorage';

import apiMiddleware from './apiMiddleware';

import createReducer from './reducer';
import rootSaga from './sagas';

export default function configureStore(api, history) {
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
      });
    }, 1000),
  );

  sagaMiddleware.run(() => rootSaga(history, api));

  return store;
}
