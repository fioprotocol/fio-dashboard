import { Store } from 'redux';

import configureStore from './store';
import api from '../api';
import { addLocationQuery } from '../helpers/routeParams';

import { AnyObject } from '../types';
import { history } from '../history';
import { CommonPromiseAction } from './types';

addLocationQuery(history);

history.listen(() => addLocationQuery(history));
export const store: Store<AnyObject> = configureStore(api, history);

export type GetState = typeof store.getState;

export type ReduxState = ReturnType<typeof store.getState>;
export type AppDispatch =
  | typeof store.dispatch
  | ((params: AnyObject) => CommonPromiseAction);
