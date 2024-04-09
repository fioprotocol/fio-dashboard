import { Middleware } from 'redux';

import { HIDDEN_PAGE_SKIP_MESSAGE } from '../constants/errors';

import { Api } from '../api';
import { ReduxState } from './init';
import { AnyType } from '../types';
import { log } from '../util/general';
import { getIsPageVisible } from '../util/screen';

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

    const isPageVisible = getIsPageVisible();

    if (!isPageVisible) {
      log.info(HIDDEN_PAGE_SKIP_MESSAGE);
      return; // Skip the request silently
    }

    const [REQUEST, SUCCESS, FAILURE] = types;

    next({ ...rest, type: REQUEST });

    return promise(api, getState).then(
      (data: AnyType) => {
        if (isPageVisible) {
          next({ ...rest, data, type: SUCCESS });
        } else {
          log.info('Page became hidden before request completed.');
        }
      },
      (error: AnyType) => next({ ...rest, error, type: FAILURE }),
    );
  };
}
