import { useCallback, useEffect, useMemo, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { useHistory } from 'react-router';

import apis from '../api';

import {
  allDomains as allDomainsSelector,
  prices as pricesSelector,
  roe as roeSelector,
} from '../redux/registrations/selectors';
import { cartItems as cartItemsSelector } from '../redux/cart/selectors';

import { getSettings } from '../redux/refProfile/actions';
import { getDomains } from '../redux/registrations/actions';
import { addItem as addItemToCart } from '../redux/cart/actions';

import { setFioName } from '../utils';
import { convertFioPrices } from '../util/prices';
import { log } from '../util/general';
import { isDomainExpired } from '../util/fio';

import { DOMAIN_TYPE } from '../constants/fio';
import { CART_ITEM_TYPE, REF_PROFILE_TYPE } from '../constants/common';
import { ROUTES } from '../constants/routes';

import { AddressWidgetDomain, RefProfile, RefProfileDomain } from '../types';
import { VerificationLoaderProps } from '../components/VerificationLoader';

type RefProfileAddressWidget = {
  options?: AddressWidgetDomain[];
  customHandleSubmit?: (item: { address: string; domain?: string }) => void;
  defaultValue?: AddressWidgetDomain;
  prefix?: string;
  showCustomDomainInput?: boolean;
  toggleShowCustomDomain?: (val: boolean) => void;
  onFocus?: () => void;
  onDomainChanged?: () => void;
  verificationProps?: VerificationLoaderProps;
};

// Check fio domain visibility and expiration
const checkDomain = async (fioDomain: { name: string }) => {
  try {
    const { is_public, expiration } =
      (await apis.fio.getFioDomain(fioDomain.name)) || {};

    return {
      fioDomain,
      check:
        !!is_public &&
        expiration &&
        !isDomainExpired(fioDomain.name, expiration),
    };
  } catch (err) {
    log.error(err);
  }
};

// Used for address widget on affiliate home page
export const useRefProfileAddressWidget = ({
  refProfileInfo,
}: {
  refProfileInfo: RefProfile;
}): RefProfileAddressWidget => {
  const allDomains = useSelector(allDomainsSelector);
  const prices = useSelector(pricesSelector);
  const roe = useSelector(roeSelector);
  const cartItems = useSelector(cartItemsSelector);
  const dispatch = useDispatch();
  const history = useHistory();

  const [showCustomDomainEdit, setShowCustomDomainEdit] = useState(false);
  const [checkedDomains, setCheckedDomains] = useState(null); // store affiliate user domains from the affiliate settings page that are public and not expired
  const [verifyLoading, toggleVerifyLoading] = useState<boolean>(false); // fch verification after user confirms selection
  const [hasFioVerificationError, toggleFioVerificationError] = useState<
    boolean
  >(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const refCode = refProfileInfo?.code;
  const { dashboardDomains } = allDomains;

  // Check fio domains if they are public and not expired
  const checkDomains = useCallback(async domains => {
    if (!domains) return [];

    const res: PromiseSettledResult<{
      check: boolean;
      fioDomain: RefProfileDomain;
    }>[] = await Promise.allSettled(domains.map(checkDomain));
    setCheckedDomains(
      res.reduce((acc, checkDomainRes) => {
        if (checkDomainRes.status === 'rejected') return acc;
        if (checkDomainRes.value.check)
          acc.push(checkDomainRes.value.fioDomain);

        return acc;
      }, []),
    );
  }, []);

  // domains that should be shown to the user - either those which set from affiliate settings or fio app premium
  const refDomainObjs: { name: string; isPremium?: boolean }[] = useMemo(() => {
    // checkedDomains are 'null' on init to understand if the check was executed or not
    if (checkedDomains === null) return [];
    // if there are no valid domains set on affiliate settings page we show fio app premium domains
    if (!checkedDomains.length)
      return dashboardDomains?.filter(({ isPremium }) => isPremium) || [];

    // show setup valid domains
    return checkedDomains;
  }, [checkedDomains, dashboardDomains]);

  // hide error message when user wants to change handle name or domain
  const onFocus = () => {
    toggleFioVerificationError(false);
    setInfoMessage(null);
  };

  // On fch selection
  const customHandleSubmit = useCallback(
    async ({
      address: addressValue,
      domain: domainValue,
    }: {
      address: string;
      domain?: string;
    }) => {
      if (!addressValue || !domainValue) return;

      // show loading state and reset prev error
      toggleVerifyLoading(true);
      toggleFioVerificationError(false);
      setInfoMessage(null);

      try {
        const refDomainObj = refDomainObjs.find(it => it.name === domainValue);

        const fch = setFioName(addressValue, domainValue);

        if (cartItems.findIndex(({ id }) => id === fch) > -1) {
          toggleFioVerificationError(true);
          setInfoMessage('Item is already in the cart.');
          return;
        }

        const isRegistered = await apis.fio.availCheckTableRows(fch);
        if (isRegistered) {
          toggleFioVerificationError(true);
          setInfoMessage('This handle is already registered.');
          return;
        }

        let isDomainRegistered = true;
        // check the domain if user typed custom
        if (!refDomainObj) {
          isDomainRegistered = await apis.fio.availCheckTableRows(domainValue);
          if (isDomainRegistered) {
            const { check } = await checkDomain({ name: domainValue });
            if (!check) {
              toggleFioVerificationError(true);
              setInfoMessage('Selected domain is not available.');
              return;
            }
          }
        }

        const price = isDomainRegistered
          ? prices.nativeFio.address
          : prices.nativeFio.combo;
        const { fio, usdc } = convertFioPrices(price, roe);

        const cartItem = {
          id: fch,
          address: addressValue,
          domain: domainValue,
          costFio: fio,
          costUsdc: usdc,
          costNativeFio: price,
          domainType: DOMAIN_TYPE.PREMIUM,
          isFree: false,
          period: 1,
          type: isDomainRegistered
            ? CART_ITEM_TYPE.ADDRESS
            : CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN,
        };

        dispatch(
          addItemToCart({
            item: cartItem,
            prices: prices?.nativeFio,
            refCode,
            roe,
          }),
        );

        history.push(ROUTES.CART);
      } catch (error) {
        log.error(error);
      } finally {
        toggleVerifyLoading(false);
      }
    },
    [
      refDomainObjs,
      cartItems,
      prices.nativeFio,
      roe,
      dispatch,
      refCode,
      history,
    ],
  );

  // convert domain objects for dropdown interface
  const options = refDomainObjs?.map(domain => ({
    id: domain.name,
    name: `@${domain.name}`,
  }));

  // check domains that was selected on affiliate settings page
  useEffect(() => {
    checkDomains(refProfileInfo?.settings?.domains);
  }, [refProfileInfo?.settings?.domains, checkDomains]);

  // get fio app domains
  useEffect(() => {
    dispatch(getDomains({ refCode }));
  }, [refCode, dispatch]);

  // update affiliate domains on component 'mount'
  useEffect(() => {
    if (refCode) dispatch(getSettings(refCode));
  }, [refCode, dispatch]);

  if (!refProfileInfo || refProfileInfo.type === REF_PROFILE_TYPE.REF)
    return {};

  return {
    customHandleSubmit,
    options,
    defaultValue: options.length > 0 ? options[0] : undefined,
    prefix: '@',
    showCustomDomainInput: showCustomDomainEdit,
    toggleShowCustomDomain: setShowCustomDomainEdit,
    onFocus,
    onDomainChanged: onFocus,
    verificationProps: {
      isVerified: false,
      hasFioVerificationError,
      hasVerifiedError: false,
      infoMessage,
      loaderText: 'Verifying ...',
      verifyLoading,
    },
  };
};
