import { createStore, applyMiddleware, compose as simpleCompose } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';

import createSagaMiddleware from 'redux-saga';

import apiMiddleware from '../apiMiddleware';

import createReducer from './reducer';
import rootSaga from './sagas';

import { Api } from '../api';

export default function configureStore(api: Api) {
  const compose =
    process.env.NODE_ENV === 'production' ? simpleCompose : composeWithDevTools;

  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    createReducer(),
    compose(applyMiddleware(apiMiddleware(api), sagaMiddleware)),
  );

  sagaMiddleware.run(() => rootSaga());

  return store;
}
