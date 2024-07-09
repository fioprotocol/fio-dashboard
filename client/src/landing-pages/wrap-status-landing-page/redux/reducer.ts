import { combineReducers, Reducer } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';

import registrations from '../../../redux/registrations/reducer';
import wrapStatus from '../../../redux/wrapStatus/reducer';

const createReducer = (history: History): Reducer =>
  combineReducers({
    router: connectRouter(history),
    registrations,
    wrapStatus,
  });

export default createReducer;
