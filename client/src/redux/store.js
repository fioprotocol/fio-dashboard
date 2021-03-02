import { createStore, applyMiddleware, compose as simpleCompose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';

import apiMiddleware from './apiMiddleware';

import reducer from './reducer';
import rootSaga from './sagas';

export default function configureStore(api, history) {
  const compose =
    process.env.NODE_ENV === 'production' ? simpleCompose : composeWithDevTools;

  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    reducer,
    compose(
      applyMiddleware(
        apiMiddleware(api),
        routerMiddleware(history),
        sagaMiddleware,
      ),
    ),
  );

  sagaMiddleware.run(() => rootSaga(history, api));

  return store;
}
