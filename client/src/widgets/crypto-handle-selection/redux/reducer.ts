import { combineReducers } from 'redux';

import fio from '../../../redux/fio/reducer';
import refProfile from '../../../redux/refProfile/reducer';
import registrations from '../../../redux/registrations/reducer';

const createReducer = () =>
  combineReducers({
    fio,
    registrations,
    refProfile,
  });

export default createReducer;
