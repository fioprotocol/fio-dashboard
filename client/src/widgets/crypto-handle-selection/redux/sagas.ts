import { all } from 'redux-saga/effects';

import { setFeesService } from '../../../redux/fio/sagas';

export default function* rootSaga() {
  yield all([setFeesService()]);
}
