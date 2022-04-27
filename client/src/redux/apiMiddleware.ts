import { Middleware } from 'redux';

import { Api } from '../api';
import { ReduxState } from './init';
import { AnyType } from '../types';

export default function apiMiddleware(api: Api): Middleware {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return dispatch(
        action((selector: (state: ReduxState) => AnyType) =>
          selector(getState()),
        ),
      );
    }

    const { promise, types, ...rest } = action;

    if (!promise) return next(action);

    const [REQUEST, SUCCESS, FAILURE] = types;

    next({ ...rest, type: REQUEST });

    return promise(api, getState).then(
      (data: AnyType) => next({ ...rest, data, type: SUCCESS }),
      (error: AnyType) => next({ ...rest, error, type: FAILURE }),
    );
  };
}
