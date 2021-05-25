import { createStore, applyMiddleware, compose as simpleCompose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import throttle from 'lodash/throttle';
import { loadState, saveState } from '../localStorage';

import apiMiddleware from './apiMiddleware';

import reducer from './reducer';
import rootSaga from './sagas';

export default function configureStore(api, history) {
  const compose =
    process.env.NODE_ENV === 'production' ? simpleCompose : composeWithDevTools;

  const sagaMiddleware = createSagaMiddleware();

  const persistedState = loadState();

  const store = createStore(
    reducer,
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
          cartItems: store.getState().cart.cartItems
        },
      });
    }, 1000),
  );

  sagaMiddleware.run(() => rootSaga(history, api));

  return store;
}
