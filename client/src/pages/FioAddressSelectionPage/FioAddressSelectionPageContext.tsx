import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { refreshFioNames } from '../../redux/fio/actions';
import { getDomains } from '../../redux/registrations/actions';
import { loadProfile } from '../../redux/profile/actions';

import { cartItems as cartItemsSelector } from '../../redux/cart/selectors';
import { fioWallets as fioWalletsSelector } from '../../redux/fio/selectors';
import {
  allDomains as allDomainsSelector,
  loading as domainsLoaingSelector,
  prices as pricesSelector,
  roe as roeSelector,
} from '../../redux/registrations/selectors';
import {
  hasFreeAddress as hasFreeAddressSelector,
  isAuthenticated as isAuthenticatedSelector,
} from '../../redux/profile/selectors';
import { refProfileInfo as refProfileInfoSelector } from '../../redux/refProfile/selectors';

import { FIO_ADDRESS_ALREADY_EXISTS } from '../../constants/errors';
import { DOMAIN_TYPE } from '../../constants/fio';
import {
  ANALYTICS_EVENT_ACTIONS,
  CART_ITEM_TYPE,
} from '../../constants/common';

import { addCartItem } from '../../util/cart';
import {
  checkAddressOrDomainIsExist,
  transformCustomDomains,
  transformNonPremiumDomains,
  transformPremiumDomains,
  validateFioAddress,
} from '../../util/fio';
import MathOp from '../../util/math';
import { convertFioPrices } from '../../util/prices';
import { setFioName } from '../../utils';
import { fireAnalyticsEventDebounced } from '../../util/analytics';

import {
  DomainsArrItemType,
  SelectedItemProps,
  UseContextProps,
} from './types';
import { AdminDomain } from '../../api/responses';
import { CartItem, Prices } from '../../types';

const ADDITIONAL_DOMAINS_COUNT_LIMIT = 12;
const USER_DOMAINS_LIMIT = 3;

const SUGGESTED_TYPE: { FIRST: 'first'; SECOND: 'second'; THIRD: 'third' } = {
  FIRST: 'first',
  SECOND: 'second',
  THIRD: 'third',
} as const;

const handleFCHItems = async ({
  address,
  cartItems,
  domainArr,
  prices,
  roe,
  setError,
}: {
  address: string;
  cartItems: CartItem[];
  domainArr: DomainsArrItemType;
  prices: Prices;
  roe: number;
  setError: (error: string) => void;
}) => {
  const {
    nativeFio: { address: nativeFioAddressPrice, domain: nativeFioDomainPrice },
  } = prices;

  fireAnalyticsEventDebounced(ANALYTICS_EVENT_ACTIONS.SEARCH_ITEM);

  return (
    await Promise.all(
      domainArr.map(async domain => {
        const {
          allowFree,
          domainType,
          name,
          swapAddressAndDomainPlaces,
          rank = 0,
        } = domain;

        let addressName = address;
        let domainName = name;

        if (swapAddressAndDomainPlaces) {
          addressName = name;
          domainName = address;
        }

        const error = await validateFioAddress(addressName, domainName);
        if (error) {
          setError(error);
          return;
        }

        const isAddressExist = await checkAddressOrDomainIsExist({
          address: addressName,
          domain: domainName,
        });

        let isUsernameOnCustomDomainExist = null;

        if (swapAddressAndDomainPlaces) {
          isUsernameOnCustomDomainExist = await checkAddressOrDomainIsExist({
            domain: domainName,
          });
        }

        if (isAddressExist) {
          fireAnalyticsEventDebounced(
            ANALYTICS_EVENT_ACTIONS.SEARCH_ITEM_ALREADY_USED,
          );
        }

        const existingCustomDomainFchCartItem = cartItems.find(
          cartItem =>
            cartItem.type === CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN &&
            cartItem.domain === domainName &&
            !!cartItem.address &&
            cartItem.id !== setFioName(addressName, domainName),
        );

        const isCustomDomain =
          domainType === DOMAIN_TYPE.CUSTOM && !existingCustomDomainFchCartItem;

        const totalNativeFio = isCustomDomain
          ? new MathOp(nativeFioAddressPrice)
              .add(nativeFioDomainPrice)
              .toNumber()
          : nativeFioAddressPrice;

        const { fio, usdc } = convertFioPrices(totalNativeFio, roe);

        return {
          id: setFioName(addressName, domainName),
          address: addressName,
          domain: domainName,
          costFio: fio,
          costUsdc: usdc,
          costNativeFio: totalNativeFio,
          nativeFioAddressPrice,
          domainType: existingCustomDomainFchCartItem
            ? DOMAIN_TYPE.PREMIUM
            : domainType,
          isSelected: false,
          isExist:
            isAddressExist ||
            (swapAddressAndDomainPlaces && isUsernameOnCustomDomainExist),
          period: 1,
          type: isCustomDomain
            ? CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN
            : CART_ITEM_TYPE.ADDRESS,
          allowFree,
          hasCustomDomain: domainType === DOMAIN_TYPE.CUSTOM,
          rank,
          swapAddressAndDomainPlaces,
        };
      }),
    )
  ).filter(Boolean);
};

const handleSelectedDomain = ({
  fchItem,
  cartItems,
  cartHasFreeItem,
  hasFreeAddress,
  prices,
  roe,
}: {
  fchItem: SelectedItemProps;
  cartItems: CartItem[];
  cartHasFreeItem: boolean;
  hasFreeAddress: boolean;
  prices: Prices;
  roe: number;
}) => {
  const {
    nativeFio: { address: nativeFioAddressPrice, domain: nativeFioDomainPrice },
  } = prices;

  const existingCartItem = cartItems.find(
    cartItem => cartItem.id === fchItem.id,
  );

  const existingDomainInCartItem = cartItems.find(
    cartItem =>
      fchItem.domainType === DOMAIN_TYPE.CUSTOM &&
      cartItem.id === fchItem.domain,
  );

  const existingCustomDomainFchCartItem = cartItems.find(
    cartItem =>
      fchItem.hasCustomDomain &&
      fchItem.domain === cartItem.domain &&
      !!cartItem.address &&
      fchItem.id !== cartItem.id,
  );

  const { domainType, allowFree, hasCustomDomain } = fchItem;
  const isCustomDomainConvertedToPremium =
    hasCustomDomain && !existingCustomDomainFchCartItem;
  const isCustomDomain =
    domainType === DOMAIN_TYPE.CUSTOM && !existingCustomDomainFchCartItem;

  const handleDomainType = () => {
    if (domainType === DOMAIN_TYPE.CUSTOM) {
      if (existingCustomDomainFchCartItem && !existingCartItem)
        return DOMAIN_TYPE.PREMIUM;
      return domainType;
    }

    if (domainType === DOMAIN_TYPE.FREE) {
      if (
        hasFreeAddress ||
        (cartHasFreeItem &&
          (!existingCartItem ||
            (!!existingCartItem &&
              existingCartItem.domainType === DOMAIN_TYPE.PREMIUM)))
      )
        return DOMAIN_TYPE.PREMIUM;

      return domainType;
    }

    if (domainType === DOMAIN_TYPE.PREMIUM) {
      if (isCustomDomainConvertedToPremium) return DOMAIN_TYPE.CUSTOM;
      if (!allowFree) return domainType;
      if (!cartHasFreeItem && !hasFreeAddress) return DOMAIN_TYPE.FREE;
      return domainType;
    }
  };

  const totalNativeFio =
    isCustomDomainConvertedToPremium ||
    domainType === DOMAIN_TYPE.CUSTOM ||
    (existingCartItem &&
      existingCartItem.type === CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN)
      ? new MathOp(nativeFioAddressPrice).add(nativeFioDomainPrice).toNumber()
      : nativeFioAddressPrice;

  const { fio, usdc } = convertFioPrices(totalNativeFio, roe);

  return {
    ...fchItem,
    costNativeFio: totalNativeFio,
    costFio: fio,
    costUsdc: usdc,
    period: existingDomainInCartItem
      ? existingDomainInCartItem.period
      : fchItem.period,
    isSelected: !!existingCartItem,
    domainType: handleDomainType(),
    type: isCustomDomain
      ? CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN
      : CART_ITEM_TYPE.ADDRESS,
  };
};

export const useContext = (): UseContextProps => {
  const allDomains = useSelector(allDomainsSelector);
  const hasFreeAddress = useSelector(hasFreeAddressSelector);
  const domainsLoaing = useSelector(domainsLoaingSelector);
  const isAuthenticated = useSelector(isAuthenticatedSelector);
  const fioWallets = useSelector(fioWalletsSelector);
  const prices = useSelector(pricesSelector);
  const roe = useSelector(roeSelector);
  const cartItems = useSelector(cartItemsSelector);
  const refProfileInfo = useSelector(refProfileInfoSelector);

  const dispatch = useDispatch();

  const {
    availableDomains = [],
    userDomains = [],
    dashboardDomains = [],
    refProfileDomains = [],
    usernamesOnCustomDomains = [],
  } = allDomains;

  const [addressValue, setAddressValue] = useState<string>(null);
  const [additionalItemsList, setAdditionalItemsList] = useState<
    SelectedItemProps[] | []
  >([]);
  const [suggestedItemsList, setSuggestedItemsList] = useState<
    SelectedItemProps[] | []
  >([]);
  const [usersItemsList, setUsersItemsList] = useState<
    SelectedItemProps[] | []
  >([]);
  const [error, setError] = useState<string>(null);
  const [loading, toggleLoading] = useState<boolean>(false);
  const [previousAddressValue, setPreviousAddressValue] = useState<string>(
    null,
  );

  const cartHasFreeItem = cartItems.some(
    cartItem => cartItem.domainType === DOMAIN_TYPE.FREE,
  );

  const refPartnerEnablesCustomDomains =
    refProfileInfo?.settings.allowCustomDomain;
  const isRefParnter = !!refProfileInfo;

  const publicDomains: Partial<AdminDomain>[] = refProfileDomains.length
    ? refProfileDomains
    : dashboardDomains;

  const sortedUserDomains = userDomains.sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  const publicUsernamesOnCustomDomains = transformCustomDomains(
    usernamesOnCustomDomains,
    true,
  ).sort((a, b) => a.rank - b.rank);

  const nonPremiumPublicDomains = transformNonPremiumDomains(
    publicDomains,
    hasFreeAddress || cartHasFreeItem,
    cartItems,
  )
    .sort((a, b) => a.rank - b.rank)
    .map((nonPremiumDomain, i) => ({ ...nonPremiumDomain, rank: i }));

  const premiumPublicDomains = transformPremiumDomains(publicDomains)
    .sort((a, b) => a.rank - b.rank)
    .map((premiumDomain, i) => ({ ...premiumDomain, rank: i }));

  const availablePublilcDomains = transformCustomDomains(availableDomains).sort(
    (a, b) => a.rank - b.rank,
  );

  const customDomains = [
    ...publicUsernamesOnCustomDomains,
    ...availablePublilcDomains,
  ];

  const userDomainsJSON = JSON.stringify(sortedUserDomains);
  const nonPremiumPublicDomainsJSON = JSON.stringify(nonPremiumPublicDomains);
  const premiumPublicDomainsJSON = JSON.stringify(premiumPublicDomains);
  const customDomainsJSON = JSON.stringify(customDomains);
  const cartItemsJSON = JSON.stringify(cartItems);
  const additionalItemsListJSON = JSON.stringify(additionalItemsList);
  const suggestedItemsListJSON = JSON.stringify(suggestedItemsList);
  const usersItemsListJSON = JSON.stringify(usersItemsList);

  useEffect(() => {
    dispatch(loadProfile());
  }, [dispatch]);

  const validateAddress = useCallback(
    async (address: string) => {
      if (!address) {
        setAdditionalItemsList([]);
        setSuggestedItemsList([]);
        setUsersItemsList([]);
        setError(null);
        return;
      }

      if (previousAddressValue === address) return;

      setError(null);

      toggleLoading(true);

      const parsedUsersDomains = JSON.parse(userDomainsJSON);
      const parsedNonPremiumDomains = JSON.parse(nonPremiumPublicDomainsJSON);
      const parsedPremiumDomains = JSON.parse(premiumPublicDomainsJSON);
      const parsedCustomDomains = JSON.parse(customDomainsJSON);
      const parsedCartItems: CartItem[] = JSON.parse(cartItemsJSON);

      const defaultParams = {
        address,
        cartItems: parsedCartItems,
        prices,
        roe,
        setError,
      };

      const validatedUserFCHPromise = handleFCHItems({
        domainArr: parsedUsersDomains,
        ...defaultParams,
      });

      const validatedNonPremiumFCHPromise = handleFCHItems({
        domainArr: parsedNonPremiumDomains,
        ...defaultParams,
      });

      const validatedPremiumFCHPromise = handleFCHItems({
        domainArr: parsedPremiumDomains,
        ...defaultParams,
      });

      const validatedCustomFCHPromise = handleFCHItems({
        domainArr: parsedCustomDomains,
        ...defaultParams,
      });
      const validatedUserFCH = await validatedUserFCHPromise;
      const validatedNonPremiumFCH = await validatedNonPremiumFCHPromise;
      const validatedPremiumFCH = await validatedPremiumFCHPromise;
      const validatedCustomFCH = await validatedCustomFCHPromise;

      const avaliableUserFCH = validatedUserFCH.length
        ? validatedUserFCH.filter(userFCH => !userFCH.isExist)
        : [];
      const availableNonPremiumFCH = validatedNonPremiumFCH.length
        ? validatedNonPremiumFCH.filter(nonPremiumFCH => !nonPremiumFCH.isExist)
        : [];
      const availablePremiumFCH = validatedPremiumFCH.length
        ? validatedPremiumFCH.filter(premiumFCH => !premiumFCH.isExist)
        : [];
      const availableCustomFCH = validatedCustomFCH.length
        ? validatedCustomFCH.filter(customFCH => !customFCH.isExist)
        : [];

      if (
        !avaliableUserFCH &&
        !availableNonPremiumFCH &&
        !availablePremiumFCH &&
        !availableCustomFCH
      ) {
        setError(FIO_ADDRESS_ALREADY_EXISTS);
        setAdditionalItemsList([]);
        setSuggestedItemsList([]);
        setUsersItemsList([]);
        toggleLoading(false);
        setPreviousAddressValue(address);
        return;
      }

      setUsersItemsList(avaliableUserFCH.slice(0, USER_DOMAINS_LIMIT));

      if (
        !availableNonPremiumFCH.length &&
        !availablePremiumFCH.length &&
        !availableCustomFCH.length
      ) {
        setAdditionalItemsList([]);
        setSuggestedItemsList([]);
        toggleLoading(false);
        setPreviousAddressValue(address);
        return;
      }

      const swapedCustomFCH = availableCustomFCH.find(
        availabelCustom => availabelCustom.swapAddressAndDomainPlaces,
      );

      let availableCustomFCHWithSwapped = [
        ...availableCustomFCH.filter(
          availabelCustom => availabelCustom.domain !== address,
        ),
      ];

      if (swapedCustomFCH) {
        availableCustomFCHWithSwapped = [swapedCustomFCH].concat(
          availableCustomFCHWithSwapped,
        );
      }

      const handleSuggestedElement = (
        suggestedType: typeof SUGGESTED_TYPE[keyof typeof SUGGESTED_TYPE],
      ) => {
        let suggestedElement = null;

        if (
          availableNonPremiumFCH[0] &&
          suggestedType === SUGGESTED_TYPE.FIRST
        ) {
          suggestedElement = availableNonPremiumFCH[0];
          availableNonPremiumFCH.shift();
          return suggestedElement;
        }
        if (
          availablePremiumFCH[0] &&
          (suggestedType === SUGGESTED_TYPE.FIRST ||
            suggestedType === SUGGESTED_TYPE.SECOND)
        ) {
          suggestedElement = availablePremiumFCH[0];
          availablePremiumFCH.shift();
          return suggestedElement;
        }
        if (
          availableCustomFCHWithSwapped[0] &&
          (suggestedType === SUGGESTED_TYPE.FIRST ||
            suggestedType === SUGGESTED_TYPE.SECOND ||
            suggestedType === SUGGESTED_TYPE.THIRD)
        ) {
          suggestedElement = availableCustomFCHWithSwapped[0];
          availableCustomFCHWithSwapped.shift();
          return suggestedElement;
        }
      };

      const suggestedPublicDomains: SelectedItemProps[] = [];

      const firstSuggested = handleSuggestedElement(SUGGESTED_TYPE.FIRST);
      const secondSuggested = handleSuggestedElement(SUGGESTED_TYPE.SECOND);
      const thirdSuggested = handleSuggestedElement(SUGGESTED_TYPE.THIRD);

      firstSuggested && suggestedPublicDomains.push(firstSuggested);
      secondSuggested && suggestedPublicDomains.push(secondSuggested);
      thirdSuggested && suggestedPublicDomains.push(thirdSuggested);

      const additionalPublicDomains: SelectedItemProps[] = [
        ...availableNonPremiumFCH,
        ...availablePremiumFCH,
        ...availableCustomFCHWithSwapped,
      ].sort((a, b) => {
        const rankCount = a.rank - b.rank;
        if (rankCount) return rankCount;

        if (a.domainType === DOMAIN_TYPE.FREE) return -1;
        if (b.domainType === DOMAIN_TYPE.FREE) return 1;

        if (a.domainType === DOMAIN_TYPE.PREMIUM) return -1;
        if (b.domainType === DOMAIN_TYPE.PREMIUM) return 1;

        if (a.domainType === DOMAIN_TYPE.CUSTOM) return -1;
        if (b.domainType === DOMAIN_TYPE.CUSTOM) return 1;

        return 0;
      });

      setAdditionalItemsList(
        additionalPublicDomains.slice(0, ADDITIONAL_DOMAINS_COUNT_LIMIT),
      );
      setSuggestedItemsList(suggestedPublicDomains);

      setPreviousAddressValue(address);

      toggleLoading(false);
    },
    [
      cartItemsJSON,
      customDomainsJSON,
      nonPremiumPublicDomainsJSON,
      premiumPublicDomainsJSON,
      previousAddressValue,
      prices,
      roe,
      userDomainsJSON,
    ],
  );

  const onClick = (selectedItem: CartItem) => {
    addCartItem(selectedItem);
  };

  useEffect(() => {
    dispatch(getDomains());
  }, [dispatch]);

  useEffect(() => {
    if (domainsLoaing) return;
    validateAddress(addressValue);
  }, [addressValue, domainsLoaing, validateAddress]);

  useEffect(() => {
    for (const fioWallet of fioWallets) {
      dispatch(refreshFioNames(fioWallet.publicKey));
    }
  }, [dispatch, fioWallets]);

  useEffect(() => {
    setPreviousAddressValue(null);
  }, [isAuthenticated]);

  useEffect(() => {
    if (loading) return;

    const parsedCartItems: CartItem[] = JSON.parse(cartItemsJSON);
    const parsedAdditionalItemsList: SelectedItemProps[] = JSON.parse(
      additionalItemsListJSON,
    );
    const parsedSuggestedItemsList: SelectedItemProps[] = JSON.parse(
      suggestedItemsListJSON,
    );
    const parsedUsersItemsList: SelectedItemProps[] = JSON.parse(
      usersItemsListJSON,
    );

    setSuggestedItemsList(
      parsedSuggestedItemsList.map(suggestedItem =>
        handleSelectedDomain({
          fchItem: suggestedItem,
          cartItems: parsedCartItems,
          cartHasFreeItem,
          hasFreeAddress,
          prices,
          roe,
        }),
      ),
    );

    setAdditionalItemsList(
      parsedAdditionalItemsList.map(additionalItem =>
        handleSelectedDomain({
          fchItem: additionalItem,
          cartItems: parsedCartItems,
          cartHasFreeItem,
          hasFreeAddress,
          prices,
          roe,
        }),
      ),
    );

    setUsersItemsList(
      parsedUsersItemsList.map(usersItem =>
        parsedCartItems.find(cartItem => cartItem.id === usersItem.id)
          ? { ...usersItem, isSelected: true }
          : { ...usersItem, isSelected: false },
      ),
    );
  }, [
    loading,
    additionalItemsListJSON,
    cartItemsJSON,
    suggestedItemsListJSON,
    usersItemsListJSON,
    cartHasFreeItem,
    hasFreeAddress,
    prices,
    roe,
  ]);

  return {
    additionalItemsList,
    addressValue,
    error,
    loading: loading || domainsLoaing,
    suggestedItemsList,
    usersItemsList,
    hideSuggestedActionButton: isRefParnter && !refPartnerEnablesCustomDomains,
    setAddressValue,
    setError,
    onClick,
  };
};
