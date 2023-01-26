import { Store } from 'redux';

import configureStore from './store';
import api, { Api } from '../api';

import { AnyObject } from '../../../types';

export const store: Store<AnyObject> = configureStore(api);

export type GetState = typeof store.getState;

export type ReduxState = ReturnType<typeof store.getState>;
export type AppDispatch =
  | typeof store.dispatch
  | ((
      params: AnyObject,
    ) => { types: string[]; promise: (api: Api) => Promise<AnyObject> });
