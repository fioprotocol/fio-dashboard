import { combineReducers } from 'redux';

import fio from '../../../redux/fio/reducer';
import registrations from '../../../redux/registrations/reducer';

const createReducer = () =>
  combineReducers({
    fio,
    registrations,
  });

export default createReducer;
