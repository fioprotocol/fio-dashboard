import { takeEvery } from 'redux-saga/effects';
import { PROFILE_FAILURE } from '../profile/actions';
import { LOGIN_FAILURE } from '../edge/actions';
import { notification } from 'antd';

export const toString = obj =>
  Object.entries(obj)
    .map(([key, val]) => `${key}: ${val}`)
    .join(', ');

export function* notify() {
  yield takeEvery('*', function(action) {
    if (
      action.error &&
      action.type !== PROFILE_FAILURE &&
      action.type !== LOGIN_FAILURE
    )
      notification.error(
        {
          message: action.error.code,
          description: action.error.message || toString(action.error.fields),
        },
        7,
      );
  });
}
