import { combineReducers, Reducer } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';

import admin from '../../redux/admin/reducer';
import modal from '../../redux/modal/reducer';
import notifications from '../../redux/notifications/reducer';
import profile from '../../redux/profile/reducer';

const createReducer = (history: History): Reducer =>
  combineReducers({
    router: connectRouter(history),
    admin,
    modal,
    notifications,
    profile,
  });

export default createReducer;
