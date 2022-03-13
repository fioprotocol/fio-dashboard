import { combineReducers } from 'redux';

import fio from '../../../redux/fio/reducer';
import cart from '../../../redux/cart/reducer';
import refProfile from '../../../redux/refProfile/reducer';
import profile from '../../../redux/profile/reducer';
import form from '../../../redux/forms/reducer';
import registrations from '../../../redux/registrations/reducer';

const createReducer = () =>
  combineReducers({
    profile,
    form,
    fio,
    registrations,
    cart,
    refProfile,
  });

export default createReducer;
