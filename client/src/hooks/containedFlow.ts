import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';

import { isAuthenticated } from '../redux/profile/selectors';
import { fioAddresses } from '../redux/fio/selectors';

import {
  CONTAINED_FLOW_ACTIONS,
  CONTAINED_FLOW_ACTIONS_TO_ROUTES,
} from '../constants/containedFlow';
import { ROUTES } from '../constants/routes';

import { compareContainedFlowAction } from '../util/containedFlow';

export const useContainedFlowActionCondition = (
  containedFlowAction: string,
): boolean => {
  const fioAddressesAmount = useSelector(fioAddresses).length;
  const isAuth = useSelector(isAuthenticated);
  const { pathname } = useLocation();
  const [actionCondition, updateActionCondition] = useState(false);

  const ACTION_ROUTES_LIST = Object.values(CONTAINED_FLOW_ACTIONS_TO_ROUTES);

  useEffect(() => {
    if (
      compareContainedFlowAction(
        containedFlowAction,
        CONTAINED_FLOW_ACTIONS.SIGNNFT,
      )
    ) {
      updateActionCondition(
        isAuth &&
          fioAddressesAmount > 0 &&
          pathname !== ROUTES.PURCHASE &&
          ACTION_ROUTES_LIST.indexOf(pathname) < 0,
      );
    }
  }, [
    containedFlowAction,
    isAuth,
    fioAddressesAmount,
    pathname,
    ACTION_ROUTES_LIST,
  ]);

  return actionCondition;
};
