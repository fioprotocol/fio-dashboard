import {
  createStore,
  applyMiddleware,
  compose as simpleCompose,
  Store,
} from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { composeWithDevTools } from '@redux-devtools/extension';
import { History } from 'history';

import createSagaMiddleware from 'redux-saga';

import apiMiddleware from '../apiMiddleware';

import createReducer from './reducer';
import rootSaga from './sagas';

import { Api } from '../api';

export default function configureStore(api: Api, history: History): Store {
  const compose =
    process.env.NODE_ENV === 'production' ? simpleCompose : composeWithDevTools;

  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    createReducer(history),
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
