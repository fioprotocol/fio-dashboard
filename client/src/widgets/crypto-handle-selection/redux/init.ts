import { Store } from 'redux';

import configureStore from './store';
import api, { Api } from '../api';

export const store: Store<any> = configureStore(api);

export type GetState = typeof store.getState;

export type ReduxState = ReturnType<typeof store.getState>;
export type AppDispatch =
  | typeof store.dispatch
  | ((params: any) => { types: string[]; promise: (api: Api) => Promise<any> });
