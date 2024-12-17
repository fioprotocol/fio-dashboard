import { put, takeEvery } from 'redux-saga/effects';

import { GET_SITE_SETTINGS_SUCCESS } from './actions';
import { API_URLS_SUCCESS } from '../registrations/actions';

import apis from '../../api';

import { FIO_API_URLS_TYPES } from '../../constants/fio';

import { Action } from '../types';

export function* getSettingsSuccess(): Generator {
  yield takeEvery(GET_SITE_SETTINGS_SUCCESS, function*(action: Action) {
    const apiUrls = action?.data?.[FIO_API_URLS_TYPES.DASHBOARD_API];
    void apis.fio.setApiUrls(apiUrls);
    const abiMap = action?.data?.FIO_RAW_ABIS;
    yield apis.fio.getRawAbi(abiMap ? JSON.parse(abiMap) : {});

    yield put<Action>({
      type: API_URLS_SUCCESS,
      data: apiUrls,
    });
  });
}
