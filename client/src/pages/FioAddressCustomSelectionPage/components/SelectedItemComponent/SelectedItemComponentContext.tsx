import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import { CART_ITEM_TYPE } from '../../../../constants/common';
import { DOMAIN_TYPE } from '../../../../constants/fio';

import { cartItems as cartItemsSelector } from '../../../../redux/cart/selectors';
import {
  prices as pricesSelector,
  roe as roeSelector,
} from '../../../../redux/registrations/selectors';
import {
  hasFreeAddress as hasFreeAddressSelector,
  usersFreeAddresses as usersFreeAddressesSelector,
} from '../../../../redux/profile/selectors';

import MathOp from '../../../../util/math';
import { convertFioPrices } from '../../../../util/prices';
import { setFioName } from '../../../../utils';
import {
  checkIsDomainItemExistsOnCart,
  transformCustomDomains,
  transformNonPremiumDomains,
  transformPremiumDomains,
} from '../../../../util/fio';

import apis from '../../../../api';

import { SelectedItemComponentProps } from './SelectedItemComponent';
import { CartItem, UserDomainType } from '../../../../types';
import { FioDomainDoubletResponse } from '../../../../api/responses';

type useContextProps = {
  selectedItemProps: CartItem;
  showPremiumInfoBadge: boolean;
};

export const useContext = (
  props: SelectedItemComponentProps,
): useContextProps => {
  const { address, domain, allDomains } = props;

  const prices = useSelector(pricesSelector);
  const roe = useSelector(roeSelector);
  const hasFreeAddress = useSelector(hasFreeAddressSelector);
  const cartItems = useSelector(cartItemsSelector);
  const usersFreeAddresses = useSelector(usersFreeAddressesSelector);

  const [chainPublicDomains, setChainPublicDomains] = useState<
    UserDomainType[]
  >([]);

  const {
    nativeFio: { address: nativeFioAddressPrice, domain: nativeFioDomainPrice },
  } = prices;

  const fchId = setFioName(address, domain);

  const existingCartItem = cartItems.find(cartItem => cartItem.id === fchId);

  const cartHasFreeItem = cartItems.some(
    cartItem =>
      cartItem.isFree && cartItem.domainType === DOMAIN_TYPE.ALLOW_FREE,
  );

  const existingDomainInCartItem = cartItems.find(cartItem =>
    checkIsDomainItemExistsOnCart(domain, cartItem),
  );

  const existingCustomDomainFchCartItem = cartItems.find(
    cartItem =>
      cartItem.type === CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN &&
      cartItem.domain === domain &&
      !!cartItem.address &&
      !cartItem.hasCustomDomainInCart &&
      !existingCartItem,
  );

  const getPublicDomainsFromChain = async (domain: string) => {
    try {
      const params = apis.fio.setTableRowsParams(domain);

      const {
        rows,
      }: { rows: FioDomainDoubletResponse[] } = await apis.fio.getTableRows(
        params,
      );

      setChainPublicDomains(
        rows
          .filter(
            row =>
              row.is_public && row.expiration > Math.floor(Date.now() / 1000),
          )
          .map(row => ({ name: row.name, domainType: DOMAIN_TYPE.PREMIUM })),
      );
    } catch (e) {
      //
    }
  };

  const {
    allRefProfileDomains,
    dashboardDomains,
    usernamesOnCustomDomains,
  } = allDomains;

  const nonPremiumDomains = dashboardDomains
    ? transformNonPremiumDomains(dashboardDomains)
    : [];
  const premiumDomains = dashboardDomains
    ? transformPremiumDomains(dashboardDomains)
    : [];
  const customDomains = usernamesOnCustomDomains
    ? transformCustomDomains(usernamesOnCustomDomains)
    : [];
  const allNonPremiumRefProfileDomains = allRefProfileDomains
    ? transformNonPremiumDomains(allRefProfileDomains)
    : [];
  const allPremiumRefProfileDomains = allRefProfileDomains
    ? transformPremiumDomains(allRefProfileDomains)
    : [];
  const userDomains = allDomains.userDomains || [];

  const domainType = !isEmpty(allDomains)
    ? [
        ...nonPremiumDomains,
        ...premiumDomains,
        ...customDomains,
        ...userDomains,
        ...chainPublicDomains.filter(
          chainPublicDomains =>
            ![
              ...(dashboardDomains || []),
              ...(allRefProfileDomains || []),
            ].some(
              dashboardPubilcDomains =>
                dashboardPubilcDomains.name === chainPublicDomains.name,
            ),
        ),
        ...allNonPremiumRefProfileDomains,
        ...allPremiumRefProfileDomains,
      ].find(publicDomain => publicDomain.name === domain)?.domainType ||
      DOMAIN_TYPE.CUSTOM
    : DOMAIN_TYPE.CUSTOM;

  const isCustomDomain = domainType === DOMAIN_TYPE.CUSTOM;

  const totalNativeFio =
    isCustomDomain && !existingCustomDomainFchCartItem
      ? new MathOp(nativeFioAddressPrice).add(nativeFioDomainPrice).toNumber()
      : nativeFioAddressPrice;

  const { fio, usdc } = convertFioPrices(totalNativeFio, roe);

  const isFirstRegFreeDomains = allRefProfileDomains?.filter(
    refProfile => refProfile.isFirstRegFree,
  );

  const existingIsFirstRegFree = isFirstRegFreeDomains?.find(
    isFirstRegFreeDomain => isFirstRegFreeDomain.name === domain,
  );

  const existingUsersFreeAddress =
    usersFreeAddresses &&
    usersFreeAddresses.find(
      freeAddress => freeAddress.name.split('@')[1] === domain,
    );

  const selectedItemProps = {
    id: fchId,
    address,
    domain,
    costFio: fio,
    costUsdc: usdc,
    costNativeFio: totalNativeFio,
    isFree:
      existingCartItem?.isFree ||
      (domainType === DOMAIN_TYPE.ALLOW_FREE &&
        (!hasFreeAddress ||
          (hasFreeAddress &&
            existingIsFirstRegFree &&
            !existingUsersFreeAddress)) &&
        !cartHasFreeItem),
    nativeFioAddressPrice,
    domainType,
    period: existingDomainInCartItem ? existingDomainInCartItem.period : 1,
    type: isCustomDomain
      ? CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN
      : CART_ITEM_TYPE.ADDRESS,
    isSelected: !!existingCartItem,
    hasCustomDomainInCart:
      existingCartItem?.hasCustomDomainInCart ||
      (isCustomDomain && !!existingCustomDomainFchCartItem),
  };

  const showPremiumInfoBadge = domainType === DOMAIN_TYPE.PREMIUM;

  useEffect(() => {
    if (domain) {
      getPublicDomainsFromChain(domain);
    }
  }, [domain]);

  return { selectedItemProps, showPremiumInfoBadge };
};
