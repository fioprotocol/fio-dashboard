import { combineReducers, Reducer } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';

import profile from './profile/reducer';
import navigation from './navigation/reducer';
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
import containedFlow from './containedFlow/reducer';
import orders from './orders/reducer';
import settings from './settings/reducer';
import wrapStatus from './wrapStatus/reducer';

const createReducer = (history: History): Reducer =>
  combineReducers({
    router: connectRouter(history),
    profile,
    navigation,
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
    containedFlow,
    wrapStatus,
    orders,
    settings,
  });

export default createReducer;
