export default function apiMiddleware(api) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return dispatch(action(selector => selector(getState())));
    }

    const { promise, types, ...rest } = action;

    if (!promise) return next(action);

    const [REQUEST, SUCCESS, FAILURE] = types;

    next({ ...rest, type: REQUEST });

    return promise(api, getState).then(
      data => next({ ...rest, data, type: SUCCESS }),
      error => next({ ...rest, error, type: FAILURE }),
    );
  };
}
