import { combineReducers, Reducer } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';

import wrapStatus from '../../../redux/wrapStatus/reducer';

const createReducer = (history: History): Reducer =>
  combineReducers({
    router: connectRouter(history),
    wrapStatus,
  });

export default createReducer;
