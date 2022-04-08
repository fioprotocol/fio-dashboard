import { Middleware } from 'redux';

import { Api } from './api';

export default function apiMiddleware(api: Api): Middleware {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return dispatch(action((selector: any) => selector(getState())));
    }

    const { promise, types, ...rest } = action;

    if (!promise) return next(action);

    const [REQUEST, SUCCESS, FAILURE] = types;

    next({ ...rest, type: REQUEST });

    return promise(api, getState).then(
      (data: any) => next({ ...rest, data, type: SUCCESS }),
      (error: any) => next({ ...rest, error, type: FAILURE }),
    );
  };
}
