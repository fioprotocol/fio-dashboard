import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { getDomains } from '../../redux/registrations/actions';
import { refreshFioNames } from '../../redux/fio/actions';
import { showLoginModal } from '../../redux/modal/actions';
import { setRedirectPath } from '../../redux/navigation/actions';

import {
  isAuthenticated as isAuthenticatedSelector,
  lastAuthData as lastAuthDataSelector,
} from '../../redux/profile/selectors';
import {
  allDomains as allDomainsSelector,
  loading as publicDomainsLoadingSelector,
} from '../../redux/registrations/selectors';
import {
  fioWallets as fioWalletsSelector,
  loading as userDomainsLoadingSelector,
} from '../../redux/fio/selectors';

import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';
import { ROUTES } from '../../constants/routes';
import { CART_ITEM_TYPE } from '../../constants/common';
import { DOMAIN_TYPE } from '../../constants/fio';

import useQuery from '../../hooks/useQuery';
import useEffectOnce from '../../hooks/general';
import { addCartItem } from '../../util/cart';
import { useCheckIfDesktop } from '../../screenType';

import { OptionProps } from '../../components/Input/EditableSelect/EditableSelect';
import { AllDomains, CartItem } from '../../types';

type UseContextProps = {
  allDomains: AllDomains;
  domainsLoading: boolean;
  initialValues: { address: string; domain: string };
  isDesktop: boolean;
  link: string;
  options: OptionProps[];
  shouldPrependUserDomains: boolean;
  onClick: (selectedItem: CartItem) => void;
};

export const useContext = (): UseContextProps => {
  const allDomains = useSelector(allDomainsSelector);
  const isAuthenticated = useSelector(isAuthenticatedSelector);
  const lastAuthData = useSelector(lastAuthDataSelector);
  const publicDomainsLoading = useSelector(publicDomainsLoadingSelector);
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
  const domainParam = queryParams.get(QUERY_PARAMS_NAMES.DOMAIN);
  const link = `${ROUTES.FIO_ADDRESSES_SELECTION}?${QUERY_PARAMS_NAMES.ADDRESS}=${addressParam}`;

  const options =
    allDomains?.userDomains.map(userDomain => ({
      value: userDomain.name,
      label: userDomain.name,
    })) || [];

  const onClick = (selectedItem: CartItem) => {
    addCartItem({
      ...selectedItem,
      allowFree: selectedItem.domainType === DOMAIN_TYPE.FREE,
      type:
        selectedItem.domainType === DOMAIN_TYPE.CUSTOM
          ? CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN
          : CART_ITEM_TYPE.ADDRESS,
    });

    if (!isAuthenticated) {
      dispatch(setRedirectPath({ pathname: ROUTES.CART }));
      lastAuthData
        ? dispatch(showLoginModal(ROUTES.CART))
        : history.push(ROUTES.CREATE_ACCOUNT);
    } else {
      history.push(ROUTES.CART);
    }
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
    domainsLoading: publicDomainsLoading || userDomainsLoading,
    initialValues: { address: addressParam, domain: domainParam },
    isDesktop,
    link,
    options,
    shouldPrependUserDomains,
    onClick,
  };
};
