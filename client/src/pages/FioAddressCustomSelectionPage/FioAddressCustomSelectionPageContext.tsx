import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { getDomains } from '../../redux/registrations/actions';
import { refreshFioNames } from '../../redux/fio/actions';

import { isAuthenticated as isAuthenticatedSelector } from '../../redux/profile/selectors';
import {
  allDomains as allDomainsSelector,
  loading as publicDomainsLoaingSelector,
} from '../../redux/registrations/selectors';
import {
  fioWallets as fioWalletsSelector,
  loading as userDomainsLoadingSelector,
} from '../../redux/fio/selectors';

import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';
import { ROUTES } from '../../constants/routes';
import { ANALYTICS_EVENT_ACTIONS } from '../../constants/common';

import useQuery from '../../hooks/useQuery';
import useEffectOnce from '../../hooks/general';
import { addCartItem } from '../../util/cart';
import { useCheckIfDesktop } from '../../screenType';
import {
  fireAnalyticsEvent,
  getCartItemsDataForAnalytics,
} from '../../util/analytics';

import { OptionProps } from '../../components/Input/EditableSelect/EditableSelect';
import { AllDomains, CartItem } from '../../types';

type UseContextProps = {
  allDomains: AllDomains;
  domainsLoaing: boolean;
  initialValues: { address: string };
  isDesktop: boolean;
  link: string;
  options: OptionProps[];
  shouldPrependUserDomains: boolean;
  onClick: (selectedItem: CartItem) => void;
};

export const useContext = (): UseContextProps => {
  const allDomains = useSelector(allDomainsSelector);
  const isAuthenticated = useSelector(isAuthenticatedSelector);
  const publicDomainsLoaing = useSelector(publicDomainsLoaingSelector);
  const fioWallets = useSelector(fioWalletsSelector);
  const userDomainsLoading = useSelector(userDomainsLoadingSelector);

  const queryParams = useQuery();
  const dispatch = useDispatch();
  const history = useHistory<{ shouldPrependUserDomains: boolean }>();

  const isDesktop = useCheckIfDesktop();

  const { location: { state } = {} } = history;
  const shouldPrependUserDomains =
    state?.shouldPrependUserDomains && isAuthenticated;

  const addressParam = queryParams.get(QUERY_PARAMS_NAMES.ADDRESS);
  const link = `${ROUTES.FIO_ADDRESSES_SELECTION}?${QUERY_PARAMS_NAMES.ADDRESS}=${addressParam}`;

  const options =
    allDomains?.userDomains.map(userDomain => ({
      value: userDomain.name,
      label: userDomain.name,
    })) || [];

  const onClick = (selectedItem: CartItem) => {
    addCartItem(selectedItem);

    fireAnalyticsEvent(
      ANALYTICS_EVENT_ACTIONS.ADD_ITEM_TO_CART,
      getCartItemsDataForAnalytics([selectedItem]),
    );

    history.push(ROUTES.CART);
  };

  useEffectOnce(() => {
    dispatch(getDomains);
  }, []);

  useEffect(() => {
    for (const fioWallet of fioWallets) {
      dispatch(refreshFioNames(fioWallet.publicKey));
    }
  }, [dispatch, fioWallets]);

  return {
    allDomains,
    domainsLoaing: publicDomainsLoaing || userDomainsLoading,
    initialValues: { address: addressParam },
    isDesktop,
    link,
    options,
    shouldPrependUserDomains,
    onClick,
  };
};
