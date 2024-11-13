import { useCallback, useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { getDomains } from '../../redux/registrations/actions';
import { refreshFioNames } from '../../redux/fio/actions';
import { showLoginModal } from '../../redux/modal/actions';
import { setRedirectPath } from '../../redux/navigation/actions';
import { addItem as addItemToCart } from '../../redux/cart/actions';

import {
  isAuthenticated as isAuthenticatedSelector,
  lastAuthData as lastAuthDataSelector,
  user as userSelector,
} from '../../redux/profile/selectors';
import {
  allDomains as allDomainsSelector,
  loading as publicDomainsLoadingSelector,
} from '../../redux/registrations/selectors';
import {
  fioWallets as fioWalletsSelector,
  loading as userDomainsLoadingSelector,
} from '../../redux/fio/selectors';
import { cartItems as cartItemsSelector } from '../../redux/cart/selectors';
import { refProfileCode } from '../../redux/refProfile/selectors';

import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';
import { ROUTES } from '../../constants/routes';
import {
  ANALYTICS_EVENT_ACTIONS,
  CART_ITEM_TYPE,
} from '../../constants/common';
import { DOMAIN_TYPE } from '../../constants/fio';

import useQuery from '../../hooks/useQuery';
import useEffectOnce from '../../hooks/general';
import { useCheckIfDesktop } from '../../screenType';
import {
  fireAnalyticsEvent,
  getCartItemsDataForAnalytics,
} from '../../util/analytics';
import { getZeroIndexPublicKey } from '../../util/snap';

import { OptionProps } from '../../components/Input/EditableSelect/EditableSelect';
import { AllDomains, CartItem } from '../../types';

type UseContextProps = {
  allDomains: AllDomains;
  domainsLoading: boolean;
  closedInitialDropdown: boolean;
  initialValues: { address: string; domain: string };
  isDesktop: boolean;
  link: string;
  options: OptionProps[];
  removeFilter: boolean;
  shouldPrependUserDomains: boolean;
  onClick: (selectedItem: CartItem) => void;
  onFieldChange: (value: string) => void;
};

export const useContext = (): UseContextProps => {
  const allDomains = useSelector(allDomainsSelector);
  const isAuthenticated = useSelector(isAuthenticatedSelector);
  const lastAuthData = useSelector(lastAuthDataSelector);
  const publicDomainsLoading = useSelector(publicDomainsLoadingSelector);
  const refCode = useSelector(refProfileCode);
  const fioWallets = useSelector(fioWalletsSelector);
  const userDomainsLoading = useSelector(userDomainsLoadingSelector);
  const cartItems = useSelector(cartItemsSelector);
  const user = useSelector(userSelector);

  const queryParams = useQuery();
  const dispatch = useDispatch();
  const history = useHistory<{
    shouldPrependUserDomains: boolean;
    closedInitialDropdown: boolean;
    removeFilter: boolean;
  }>();

  const isDesktop = useCheckIfDesktop();

  const { location: { state } = {} } = history;
  const shouldPrependUserDomains =
    state?.shouldPrependUserDomains && isAuthenticated;
  const closedInitialDropdown = state?.closedInitialDropdown && isAuthenticated;
  const removeFilter = state?.removeFilter && isAuthenticated;

  const addressParam = queryParams.get(QUERY_PARAMS_NAMES.ADDRESS);
  const domainParam = queryParams.get(QUERY_PARAMS_NAMES.DOMAIN);

  const rootLink = domainParam
    ? ROUTES.FIO_DOMAINS
    : ROUTES.FIO_ADDRESSES_SELECTION;

  let defaultInitialLink = rootLink;

  if (addressParam)
    defaultInitialLink =
      defaultInitialLink + `?${QUERY_PARAMS_NAMES.ADDRESS}=${addressParam}`;

  const [link, setLink] = useState<string>(defaultInitialLink);
  const [hasItemAddedToCart, toggleHasItemAddedToCart] = useState<boolean>(
    false,
  );

  const options =
    allDomains?.userDomains
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(userDomain => ({
        value: userDomain.name,
        label: userDomain.name,
      })) || [];

  const onClick = useCallback(
    async (selectedItem: CartItem) => {
      const newItem = {
        ...selectedItem,
        type:
          selectedItem.domainType === DOMAIN_TYPE.CUSTOM
            ? CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN
            : CART_ITEM_TYPE.ADDRESS,
      };

      const metamaskUserPublicKey = await getZeroIndexPublicKey(
        user?.userProfileType,
      );

      dispatch(
        addItemToCart({
          item: newItem,
          publicKey: metamaskUserPublicKey,
          refCode,
        }),
      );

      toggleHasItemAddedToCart(true);
    },
    [dispatch, refCode, user?.userProfileType],
  );

  const onFieldChange = (value: string) => {
    if (!value) {
      setLink(rootLink);
    } else {
      setLink(
        domainParam
          ? rootLink
          : `${ROUTES.FIO_ADDRESSES_SELECTION}?${QUERY_PARAMS_NAMES.ADDRESS}=${value}`,
      );
    }
  };

  useEffectOnce(() => {
    dispatch(getDomains({ refCode }));
  }, []);

  useEffect(() => {
    for (const fioWallet of fioWallets) {
      dispatch(refreshFioNames(fioWallet.publicKey));
    }
  }, [dispatch, fioWallets]);

  useEffect(() => {
    if (hasItemAddedToCart) {
      if (!isAuthenticated) {
        dispatch(setRedirectPath({ pathname: ROUTES.CART }));
        lastAuthData
          ? dispatch(showLoginModal(ROUTES.CART))
          : history.push(ROUTES.CREATE_ACCOUNT);
      } else {
        fireAnalyticsEvent(
          ANALYTICS_EVENT_ACTIONS.BEGIN_CHECKOUT,
          getCartItemsDataForAnalytics(cartItems),
        );
        history.push(ROUTES.CART);
      }
    }
  }, [
    cartItems,
    dispatch,
    hasItemAddedToCart,
    history,
    isAuthenticated,
    lastAuthData,
  ]);

  return {
    allDomains,
    domainsLoading: publicDomainsLoading || userDomainsLoading,
    closedInitialDropdown,
    initialValues: { address: addressParam, domain: domainParam },
    isDesktop,
    link,
    options,
    removeFilter,
    shouldPrependUserDomains,
    onClick,
    onFieldChange,
  };
};
