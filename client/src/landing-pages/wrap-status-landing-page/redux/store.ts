import { createStore, applyMiddleware, compose as simpleCompose } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';
import { History } from 'history';

import createSagaMiddleware from 'redux-saga';

import apiMiddleware from '../apiMiddleware';

import createReducer from './reducer';

import { Api } from '../api';

export default function configureStore(api: Api, history: History) {
  const compose =
    process.env.NODE_ENV === 'production' ? simpleCompose : composeWithDevTools;

  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    createReducer(history),
    compose(applyMiddleware(apiMiddleware(api), sagaMiddleware)),
  );

  return store;
}
