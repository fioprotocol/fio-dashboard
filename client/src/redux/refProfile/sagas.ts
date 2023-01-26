import { takeEvery } from 'redux-saga/effects';

import { REF_PROFILE_TYPE } from '../../constants/common';
import { GET_REF_PROFILE_SUCCESS } from './actions';

import { Action } from '../types';

export function* getRefProfileSuccess(): Generator {
  yield takeEvery(GET_REF_PROFILE_SUCCESS, function*(action: Action) {
    if (action.data?.code) {
      yield window.dataLayer?.push({
        event: 'userData',
        refid:
          action.data?.type === REF_PROFILE_TYPE.REF
            ? action.data?.code
            : 'Affiliate',
      });
    }
  });
}
