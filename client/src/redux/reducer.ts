import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';

import profile from './profile/reducer';
import navigation from './navigation/reducer';
import users from './users/reducer';
import edge from './edge/reducer';
import fio from './fio/reducer';
import fioWalletsData from './fioWalletsData/reducer';
import modal from './modal/reducer';
import notifications from './notifications/reducer';
import contacts from './contacts/reducer';
import registrations from './registrations/reducer';
import cart from './cart/reducer';
import refProfile from './refProfile/reducer';
import account from './account/reducer';

const createReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    profile,
    navigation,
    users,
    edge,
    fio,
    fioWalletsData,
    modal,
    notifications,
    contacts,
    registrations,
    cart,
    refProfile,
    account,
  });

export default createReducer;
