import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import {
  CART_ITEM_PERIOD_OPTIONS_IDS,
  CART_ITEM_TYPE,
  DEFAULT_CART_ITEM_PERIOD_OPTION,
} from '../../../../constants/common';
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

import { handleFullPriceForMultiYearItems } from '../../../../util/prices';
import { FIO_ADDRESS_DELIMITER, setFioName } from '../../../../utils';
import {
  checkIsDomainItemExistsOnCart,
  transformCustomDomains,
  transformNonPremiumDomains,
  transformPremiumDomains,
} from '../../../../util/fio';
import MathOp from '../../../../util/math';

import apis from '../../../../api';

import { SelectedItemComponentProps } from './SelectedItemComponent';
import { CartItem, DomainItemType, UserDomainType } from '../../../../types';
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
    nativeFio: { address: nativeFioAddressPrice },
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
              row.is_public &&
              row.expiration >
                new MathOp(Date.now())
                  .div(1000)
                  .round(0, 0)
                  .toNumber(),
          )
          .map(row => ({ name: row.name, domainType: DOMAIN_TYPE.PREMIUM })),
      );
    } catch (e) {
      //
    }
  };

  const {
    dashboardDomains,
    usernamesOnCustomDomains,
    refProfileDomains,
  } = allDomains;

  const publicDomains = refProfileDomains?.length
    ? refProfileDomains
    : dashboardDomains;

  const nonPremiumDomains = publicDomains
    ? transformNonPremiumDomains(publicDomains)
    : [];
  const premiumDomains = publicDomains
    ? transformPremiumDomains(publicDomains)
    : [];
  const customDomains = usernamesOnCustomDomains
    ? transformCustomDomains(usernamesOnCustomDomains)
    : [];

  const userDomains = allDomains.userDomains || [];

  const domainType: DomainItemType = !isEmpty(allDomains)
    ? [
        ...nonPremiumDomains,
        ...premiumDomains,
        ...customDomains,
        ...userDomains,
        ...chainPublicDomains.filter(
          chainPublicDomains =>
            ![...(publicDomains || [])].some(
              dashboardPublicDomains =>
                dashboardPublicDomains.name === chainPublicDomains.name,
            ),
        ),
      ].find(publicDomain => publicDomain.name === domain)?.domainType ||
      DOMAIN_TYPE.CUSTOM
    : DOMAIN_TYPE.CUSTOM;

  const isCustomDomain = domainType === DOMAIN_TYPE.CUSTOM;

  const isComboItem = isCustomDomain && !existingCustomDomainFchCartItem;

  const firstRegFreeArr = [];

  if (publicDomains) {
    firstRegFreeArr.push(...publicDomains);
  }

  const isFirstRegFreeDomains = firstRegFreeArr.filter(
    refProfile => refProfile.isFirstRegFree,
  );

  const existingIsFirstRegFree = isFirstRegFreeDomains?.find(
    isFirstRegFreeDomain => isFirstRegFreeDomain.name === domain,
  );

  const existingUsersFreeAddress =
    usersFreeAddresses &&
    usersFreeAddresses.find(
      freeAddress =>
        freeAddress.name.split(FIO_ADDRESS_DELIMITER)[1] === domain,
    );

  const period = existingDomainInCartItem
    ? existingDomainInCartItem.period
    : isCustomDomain
    ? parseFloat(DEFAULT_CART_ITEM_PERIOD_OPTION.id)
    : parseFloat(CART_ITEM_PERIOD_OPTIONS_IDS.ONE_YEAR);

  const {
    fio: costFio,
    usdc: costUsdc,
    costNativeFio,
  } = handleFullPriceForMultiYearItems({
    prices: prices?.nativeFio,
    period,
    roe,
    registerOnlyAddress: !isComboItem,
    includeAddress: isComboItem,
  });

  const selectedItemProps = {
    id: fchId,
    address,
    domain,
    costFio,
    costUsdc,
    costNativeFio,
    isFree:
      existingCartItem?.isFree ||
      (domainType === DOMAIN_TYPE.ALLOW_FREE &&
        (!hasFreeAddress ||
          (hasFreeAddress &&
            !!existingIsFirstRegFree &&
            !existingUsersFreeAddress)) &&
        !cartHasFreeItem),
    nativeFioAddressPrice,
    domainType,
    period,
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
