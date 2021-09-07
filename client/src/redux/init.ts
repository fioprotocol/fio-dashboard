import { Store } from 'redux';
import configureStore from './store';
import api, { Api } from '../api';
import createHistory from 'history/createBrowserHistory';
import { addLocationQuery } from '../helpers/routeParams';

export const history = createHistory();

addLocationQuery(history);

history.listen(() => addLocationQuery(history));
export const store: Store<any> = configureStore(api, history);

export type ReduxState = ReturnType<typeof store.getState>;
export type AppDispatch =
  | typeof store.dispatch
  | ((params: any) => { types: string[]; promise: (api: Api) => Promise<any> });
