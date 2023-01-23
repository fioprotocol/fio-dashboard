import { useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import { CART_ITEM_TYPE } from '../../../../constants/common';
import { DOMAIN_TYPE } from '../../../../constants/fio';

import {
  prices as pricesSelector,
  roe as roeSelector,
} from '../../../../redux/registrations/selectors';
import { hasFreeAddress as hasFreeAddressSelector } from '../../../../redux/profile/selectors';

import MathOp from '../../../../util/math';
import { convertFioPrices } from '../../../../util/prices';
import { setFioName } from '../../../../utils';
import {
  transformCustomDomains,
  transformNonPremiumDomains,
  transformPremiumDomains,
} from '../../../../util/fio';

import { SelectedItemComponentProps } from './SelectedItemComponent';
import { CartItem } from '../../../../types';

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

  const {
    nativeFio: { address: natvieFioAddressPrice, domain: nativeFioDomainPrice },
  } = prices;

  const nonPremiumDomains = allDomains.dashboardDomains
    ? transformNonPremiumDomains(allDomains.dashboardDomains, hasFreeAddress)
    : [];
  const premiumDomains = allDomains.dashboardDomains
    ? transformPremiumDomains(allDomains.dashboardDomains)
    : [];
  const customDomains = allDomains.usernamesOnCustomDomains
    ? transformCustomDomains(allDomains.usernamesOnCustomDomains)
    : [];
  const userDomains = allDomains.userDomains || [];
  const refProfileDomains = allDomains.refProfileDomains || [];

  const domainType = !isEmpty(allDomains)
    ? [
        ...nonPremiumDomains,
        ...premiumDomains,
        ...customDomains,
        ...userDomains,
        ...refProfileDomains,
      ].find(publicDomain => publicDomain.name === domain)?.domainType ||
      DOMAIN_TYPE.CUSTOM
    : DOMAIN_TYPE.CUSTOM;

  const isCustomDomain = domainType === DOMAIN_TYPE.CUSTOM;

  const totalNativeFio = isCustomDomain
    ? new MathOp(natvieFioAddressPrice).add(nativeFioDomainPrice).toNumber()
    : natvieFioAddressPrice;

  const { fio, usdc } = convertFioPrices(totalNativeFio, roe);

  const selectedItemProps = {
    id: setFioName(address, domain),
    address,
    domain,
    costFio: fio,
    costUsdc: usdc,
    costNativeFio: totalNativeFio,
    domainType,
    period: 1,
    type: CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN,
  };

  const showPremiumInfoBadge = domainType === DOMAIN_TYPE.PREMIUM;

  return { selectedItemProps, showPremiumInfoBadge };
};
