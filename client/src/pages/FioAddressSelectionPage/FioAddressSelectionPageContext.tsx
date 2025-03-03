import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import isEqual from 'lodash/isEqual';

import { addItem as addItemToCart } from '../../redux/cart/actions';
import { refreshFioNames } from '../../redux/fio/actions';
import { getDomains } from '../../redux/registrations/actions';
import { loadProfile } from '../../redux/profile/actions';

import { cartItems as cartItemsSelector } from '../../redux/cart/selectors';
import { fioWallets as fioWalletsSelector } from '../../redux/fio/selectors';
import {
  allDomains as allDomainsSelector,
  loading as domainsLoadingSelector,
  prices as pricesSelector,
  roe as roeSelector,
} from '../../redux/registrations/selectors';
import {
  hasFreeAddress as hasFreeAddressSelector,
  isAuthenticated as isAuthenticatedSelector,
  usersFreeAddresses as usersFreeAddressesSelector,
} from '../../redux/profile/selectors';
import {
  refProfileCode,
  isAffiliateProfile as isAffiliateProfileSelector,
} from '../../redux/refProfile/selectors';

import { FIO_ADDRESS_ALREADY_EXISTS } from '../../constants/errors';
import { DOMAIN_TYPE } from '../../constants/fio';
import {
  ANALYTICS_EVENT_ACTIONS,
  CART_ITEM_TYPE,
} from '../../constants/common';

import {
  checkAddressOrDomainIsExist,
  transformCustomDomains,
  transformNonPremiumDomains,
  transformPremiumDomains,
  validateFioAddress,
} from '../../util/fio';

import { convertFioPrices } from '../../util/prices';
import { FIO_ADDRESS_DELIMITER, setFioName } from '../../utils';
import { fireAnalyticsEventDebounced } from '../../util/analytics';
import apis from '../../api';

import {
  DomainsArrItemType,
  DomainsItemType,
  SelectedItemProps,
  UseContextProps,
} from './types';
import { AdminDomain } from '../../api/responses';
import { CartItem, Prices, Roe } from '../../types';

const ADDITIONAL_DOMAINS_COUNT_LIMIT = 12;
const USER_DOMAINS_LIMIT = 3;

const SUGGESTED_TYPE: { FIRST: 'first'; SECOND: 'second'; THIRD: 'third' } = {
  FIRST: 'first',
  SECOND: 'second',
  THIRD: 'third',
} as const;

const INFO_MESSAGES = {
  FIO_HANDLE_ALREADY_EXISTS: {
    title: 'Unavailable',
    message:
      'The handle you entered is not available. We have made some alter suggestions below.',
  },
};

type HandledFioHandleType = {
  id: string;
  address: string;
  domain: string;
  costFio: string;
  costUsdc: string;
  costNativeFio: string;
  nativeFioAddressPrice: string;
  domainType: string;
  isFree: boolean;
  isSelected: boolean;
  isExist: boolean;
  period: number;
  type: string;
  hasCustomDomainInCart: boolean;
  rank: number;
  swapAddressAndDomainPlaces: boolean;
};

const handleFCHItems = async ({
  address,
  cartItems,
  cartHasFreeItem,
  domainArr,
  hasFreeAddress,
  isAffiliateProfile,
  prices,
  roe,
  usersFreeAddresses,
  setError,
}: {
  address: string;
  cartItems: CartItem[];
  cartHasFreeItem: boolean;
  domainArr: DomainsArrItemType;
  hasFreeAddress: boolean;
  isAffiliateProfile: boolean;
  prices: Prices;
  roe: Roe;
  usersFreeAddresses: { name: string }[];
  setError: (error: string) => void;
}) => {
  const {
    nativeFio: { address: nativeFioAddressPrice, combo: nativeFioComboPrice },
  } = prices;

  fireAnalyticsEventDebounced(ANALYTICS_EVENT_ACTIONS.SEARCH_ITEM);

  if (domainArr.length === 0) {
    return [];
  }

  const error = validateFioAddress(address, domainArr[0]?.name);

  if (error) {
    setError(error);
    return [];
  }

  return (
    await Promise.all(
      domainArr.map(async domain => {
        const {
          domainType,
          name,
          swapAddressAndDomainPlaces,
          rank = 0,
          isFirstRegFree,
        } = domain;

        let addressName = address;
        let domainName = name;

        if (swapAddressAndDomainPlaces) {
          addressName = name;
          domainName = address;
        }

        const error = validateFioAddress(addressName, domainName);
        if (error) {
          setError(error);
          return;
        }

        const isAddressExist = await checkAddressOrDomainIsExist({
          address: addressName,
          domain: domainName,
          fireAnalytics: fireAnalyticsEventDebounced,
        });

        let isUsernameOnCustomDomainExist = null;

        if (swapAddressAndDomainPlaces) {
          isUsernameOnCustomDomainExist = await checkAddressOrDomainIsExist({
            domain: domainName,
            fireAnalytics: fireAnalyticsEventDebounced,
          });
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
          ? nativeFioComboPrice
          : nativeFioAddressPrice;

        const { fio, usdc } = convertFioPrices(totalNativeFio, roe);

        const existingUsersFreeAddress =
          usersFreeAddresses &&
          usersFreeAddresses.find(
            freeAddress =>
              freeAddress.name.split(FIO_ADDRESS_DELIMITER)[1] === domainName,
          );

        return {
          id: setFioName(addressName, domainName),
          address: addressName,
          domain: domainName,
          costFio: fio,
          costUsdc: usdc,
          costNativeFio: totalNativeFio,
          nativeFioAddressPrice,
          domainType,
          isFree:
            !isAffiliateProfile &&
            domainType === DOMAIN_TYPE.ALLOW_FREE &&
            (!hasFreeAddress ||
              (hasFreeAddress &&
                isFirstRegFree &&
                !existingUsersFreeAddress)) &&
            !cartHasFreeItem,
          isSelected: false,
          isExist:
            isAddressExist ||
            (swapAddressAndDomainPlaces && isUsernameOnCustomDomainExist),
          period: 1,
          type:
            domainType === DOMAIN_TYPE.CUSTOM
              ? CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN
              : CART_ITEM_TYPE.ADDRESS,
          hasCustomDomainInCart:
            domainType === DOMAIN_TYPE.CUSTOM &&
            !!existingCustomDomainFchCartItem,
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
  domains,
  hasFreeAddress,
  prices,
  roe,
  usersFreeAddresses,
}: {
  fchItem: SelectedItemProps;
  cartItems: CartItem[];
  cartHasFreeItem: boolean;
  domains: DomainsItemType[];
  hasFreeAddress: boolean;
  prices: Prices;
  roe: Roe;
  usersFreeAddresses: { name: string }[];
}) => {
  const {
    nativeFio: { address: nativeFioAddressPrice, combo: nativeFioComboPrice },
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
      fchItem.domainType === DOMAIN_TYPE.CUSTOM &&
      (cartItem.type === CART_ITEM_TYPE.DOMAIN ||
        cartItem.type === CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN) &&
      fchItem.domain === cartItem.domain &&
      !!cartItem.address &&
      fchItem.id !== cartItem.id &&
      !cartItem.hasCustomDomainInCart,
  );

  const { domain, domainType, type } = fchItem;

  const isFirstRegFreeDomains = domains.filter(
    domainItem => domainItem.isFirstRegFree,
  );

  const existingIsFirstRegFree = isFirstRegFreeDomains.find(
    isFirstRegFreeDomain => isFirstRegFreeDomain.name === domain,
  );

  const existingUsersFreeAddress =
    usersFreeAddresses &&
    usersFreeAddresses.find(
      freeAddress =>
        freeAddress.name.split(FIO_ADDRESS_DELIMITER)[1] === domain,
    );

  const isCustomDomain =
    domainType === DOMAIN_TYPE.CUSTOM && !existingCustomDomainFchCartItem;
  const isFree =
    existingCartItem?.isFree ||
    (domainType === DOMAIN_TYPE.ALLOW_FREE &&
      (!hasFreeAddress ||
        (usersFreeAddresses &&
          existingIsFirstRegFree &&
          !existingUsersFreeAddress)) &&
      !cartHasFreeItem);

  const totalNativeFio =
    isCustomDomain ||
    (existingCartItem &&
      existingCartItem.type === CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN &&
      !existingCartItem.hasCustomDomainInCart)
      ? nativeFioComboPrice
      : nativeFioAddressPrice;

  const { fio, usdc } = convertFioPrices(totalNativeFio, roe);

  return {
    ...fchItem,
    costNativeFio: existingCartItem?.costNativeFio || totalNativeFio,
    costFio: existingCartItem?.costFio || fio,
    costUsdc: existingCartItem?.costUsdc || usdc,
    hasCustomDomainInCart:
      existingCartItem?.hasCustomDomainInCart ||
      (domainType === DOMAIN_TYPE.CUSTOM && !!existingCustomDomainFchCartItem),
    period: existingDomainInCartItem
      ? existingDomainInCartItem.period
      : fchItem.period,
    isSelected: !!existingCartItem,
    isFree,
    domainType,
    type,
  };
};

export const useContext = (): UseContextProps => {
  const allDomains = useSelector(allDomainsSelector);
  const hasFreeAddress = useSelector(hasFreeAddressSelector);
  const domainsLoading = useSelector(domainsLoadingSelector);
  const isAuthenticated = useSelector(isAuthenticatedSelector);
  const fioWallets = useSelector(fioWalletsSelector);
  const prices = useSelector(pricesSelector);
  const refCode = useSelector(refProfileCode);
  const isAffiliateProfile = useSelector(isAffiliateProfileSelector);
  const roe = useSelector(roeSelector);
  const cartItems = useSelector(cartItemsSelector);
  const usersFreeAddresses = useSelector(usersFreeAddressesSelector);

  const dispatch = useDispatch();

  const {
    availableDomains = [],
    userDomains = [],
    dashboardDomains = [],
    refProfileDomains = [],
    usernamesOnCustomDomains = [],
  } = allDomains;

  const nonGateRefProfileDomains = refProfileDomains.filter(
    refProfileDomain => !refProfileDomain.hasGatedRegistration,
  );

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
  const [infoMessage, setInfo] = useState<{ title: string; message: string }>(
    null,
  );
  const [loading, toggleLoading] = useState<boolean>(false);
  const [previousAddressValue, setPreviousAddressValue] = useState<string>(
    null,
  );

  const cartHasFreeItem = cartItems.some(
    cartItem =>
      cartItem.isFree && cartItem.domainType === DOMAIN_TYPE.ALLOW_FREE,
  );

  const publicDomains: Partial<AdminDomain>[] = nonGateRefProfileDomains.length
    ? nonGateRefProfileDomains
    : dashboardDomains;

  const sortedUserDomains = userDomains.sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  const publicUsernamesOnCustomDomains = transformCustomDomains(
    usernamesOnCustomDomains,
    true,
  ).sort((a, b) => a.rank - b.rank);

  const nonPremiumPublicDomains = transformNonPremiumDomains(publicDomains)
    .sort((a, b) => a.rank - b.rank)
    .map((nonPremiumDomain, i) => ({ ...nonPremiumDomain, rank: i }));

  const premiumPublicDomains = transformPremiumDomains(publicDomains)
    .sort((a, b) => a.rank - b.rank)
    .map((premiumDomain, i) => ({ ...premiumDomain, rank: i }));

  const availablePublicDomains = transformCustomDomains(availableDomains).sort(
    (a, b) => a.rank - b.rank,
  );

  const customDomains = [
    ...publicUsernamesOnCustomDomains,
    ...availablePublicDomains,
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

  const setUsersItemsListIfChanged = useCallback(
    (updatedState: SelectedItemProps[]) =>
      setUsersItemsList(prevState =>
        isEqual(prevState, updatedState) ? prevState : updatedState,
      ),
    [],
  );

  const validateAddress = useCallback(
    async (address: string) => {
      if (!address) {
        setAdditionalItemsList([]);
        setSuggestedItemsList([]);
        setUsersItemsListIfChanged([]);
        setError(null);
        setInfo(null);
        return;
      }

      if (previousAddressValue === address) return;

      setError(null);
      setInfo(null);

      toggleLoading(true);

      const fioHandleHasDomainPart =
        address.indexOf(FIO_ADDRESS_DELIMITER) > 0 &&
        address.indexOf(FIO_ADDRESS_DELIMITER) < address.length - 1;

      const fioHandlePart = fioHandleHasDomainPart
        ? address.split(FIO_ADDRESS_DELIMITER)[0]
        : address;

      const fioDomainPart = fioHandleHasDomainPart
        ? address.split(FIO_ADDRESS_DELIMITER)[1]
        : null;

      const parsedUsersDomains: DomainsArrItemType = JSON.parse(
        userDomainsJSON,
      );
      const parsedNonPremiumDomains: DomainsArrItemType = JSON.parse(
        nonPremiumPublicDomainsJSON,
      );
      const parsedPremiumDomains: DomainsArrItemType = JSON.parse(
        premiumPublicDomainsJSON,
      );
      const parsedCustomDomains: DomainsArrItemType = JSON.parse(
        customDomainsJSON,
      );
      const parsedCartItems: CartItem[] = JSON.parse(cartItemsJSON);

      const handleFioDomainPart = (domainArr: DomainsArrItemType) => {
        const existingFioDomainPartIndex = domainArr.findIndex(
          domainItem => domainItem.name === fioDomainPart,
        );

        if (existingFioDomainPartIndex !== -1) {
          const existingFioDomainPart = domainArr[existingFioDomainPartIndex];
          domainArr.splice(existingFioDomainPartIndex, 1);
          domainArr.unshift(existingFioDomainPart);

          return true;
        }

        return false;
      };

      if (fioDomainPart) {
        const fioDomainPartExistsOnUsersDomains = handleFioDomainPart(
          parsedUsersDomains,
        );

        const fioDomainPartExistsOnNonPremiumDomains = handleFioDomainPart(
          parsedNonPremiumDomains,
        );
        const fioDomainPartExistsOnPremiumDomains = handleFioDomainPart(
          parsedPremiumDomains,
        );
        const fioDomainPartExistsOnParsedCustomDomains = handleFioDomainPart(
          parsedCustomDomains,
        );

        if (
          !fioDomainPartExistsOnNonPremiumDomains &&
          !fioDomainPartExistsOnPremiumDomains &&
          !fioDomainPartExistsOnParsedCustomDomains &&
          !fioDomainPartExistsOnUsersDomains
        ) {
          const domainExistInBlockChain = await apis.fio.getFioDomain(
            fioDomainPart,
          );

          if (!domainExistInBlockChain) {
            parsedCustomDomains.unshift({
              name: fioDomainPart,
              domainType: DOMAIN_TYPE.CUSTOM,
              rank: 0,
              swapAddressAndDomainPlaces: false,
            });
          } else {
            if (domainExistInBlockChain.is_public) {
              parsedPremiumDomains.unshift({
                name: fioDomainPart,
                domainType: DOMAIN_TYPE.PREMIUM,
                rank: 0,
                swapAddressAndDomainPlaces: false,
              });
            } else {
              setInfo(INFO_MESSAGES.FIO_HANDLE_ALREADY_EXISTS);
            }
          }
        }
      }

      const defaultParams = {
        address: fioHandlePart,
        cartItems: parsedCartItems,
        cartHasFreeItem,
        hasFreeAddress,
        prices,
        roe,
        usersFreeAddresses,
        isAffiliateProfile,
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

      const availableUserFCH = validatedUserFCH.length
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

      const findExistingFioHandleInBlockChain = (
        fioHandlesArray: HandledFioHandleType[],
      ) => {
        if (!fioHandlesArray) return false;

        return fioHandlesArray.some(
          fioHandleItem =>
            fioHandleItem.isExist && fioHandleItem.id === address,
        );
      };

      const ifFullFioHandleExists =
        fioDomainPart &&
        (findExistingFioHandleInBlockChain(validatedUserFCH) ||
          findExistingFioHandleInBlockChain(validatedNonPremiumFCH) ||
          findExistingFioHandleInBlockChain(validatedPremiumFCH) ||
          findExistingFioHandleInBlockChain(validatedCustomFCH));

      if (ifFullFioHandleExists)
        setInfo(INFO_MESSAGES.FIO_HANDLE_ALREADY_EXISTS);

      if (
        !availableUserFCH &&
        !availableNonPremiumFCH &&
        !availablePremiumFCH &&
        !availableCustomFCH
      ) {
        setError(FIO_ADDRESS_ALREADY_EXISTS);
        setAdditionalItemsList([]);
        setSuggestedItemsList([]);
        setUsersItemsListIfChanged([]);
        toggleLoading(false);
        setPreviousAddressValue(address);
        return;
      }

      setUsersItemsListIfChanged(availableUserFCH.slice(0, USER_DOMAINS_LIMIT));

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

      const swappedCustomFCH = availableCustomFCH.find(
        availableCustom => availableCustom.swapAddressAndDomainPlaces,
      );

      let availableCustomFCHWithSwapped = [
        ...availableCustomFCH.filter(
          availableCustom => availableCustom.domain !== fioHandlePart,
        ),
      ];

      if (swappedCustomFCH) {
        if (
          availableCustomFCHWithSwapped[0]?.id === address &&
          fioHandleHasDomainPart
        ) {
          availableCustomFCHWithSwapped.splice(1, 0, swappedCustomFCH);
        } else {
          availableCustomFCHWithSwapped = [swappedCustomFCH].concat(
            availableCustomFCHWithSwapped,
          );
        }
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

      const shouldChangePlacesNonPremiumWithPremium =
        fioHandleHasDomainPart &&
        firstSuggested.domainType === DOMAIN_TYPE.ALLOW_FREE &&
        !firstSuggested?.isFree &&
        secondSuggested?.id === address;

      if (shouldChangePlacesNonPremiumWithPremium) {
        secondSuggested && suggestedPublicDomains.push(secondSuggested);
        firstSuggested && suggestedPublicDomains.push(firstSuggested);
      } else {
        firstSuggested && suggestedPublicDomains.push(firstSuggested);
        secondSuggested && suggestedPublicDomains.push(secondSuggested);
      }

      thirdSuggested && suggestedPublicDomains.push(thirdSuggested);

      const additionalPublicDomains: SelectedItemProps[] = [
        ...availableNonPremiumFCH,
        ...availablePremiumFCH,
        ...availableCustomFCHWithSwapped,
      ].sort((a, b) => {
        const rankCount = a.rank - b.rank;
        if (rankCount) return rankCount;

        if (a.domainType === DOMAIN_TYPE.ALLOW_FREE) return -1;
        if (b.domainType === DOMAIN_TYPE.ALLOW_FREE) return 1;

        if (a.domainType === DOMAIN_TYPE.PREMIUM) return -1;
        if (b.domainType === DOMAIN_TYPE.PREMIUM) return 1;

        if (a.domainType === DOMAIN_TYPE.CUSTOM && a.swapAddressAndDomainPlaces)
          return -1;
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
      setUsersItemsListIfChanged,
      cartHasFreeItem,
      cartItemsJSON,
      customDomainsJSON,
      hasFreeAddress,
      nonPremiumPublicDomainsJSON,
      premiumPublicDomainsJSON,
      previousAddressValue,
      prices,
      roe,
      userDomainsJSON,
      usersFreeAddresses,
    ],
  );

  const onClick = useCallback(
    async (selectedItem: CartItem) => {
      dispatch(
        addItemToCart({
          item: selectedItem,
          refCode,
        }),
      );
    },
    [dispatch, refCode],
  );

  useEffect(() => {
    dispatch(getDomains({ refCode }));
  }, [refCode, dispatch]);

  useEffect(() => {
    if (domainsLoading) return;
    validateAddress(addressValue);
  }, [addressValue, domainsLoading, validateAddress]);

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
    const publicDomains = JSON.parse(nonPremiumPublicDomainsJSON);

    setSuggestedItemsList(
      parsedSuggestedItemsList.map(suggestedItem =>
        handleSelectedDomain({
          fchItem: suggestedItem,
          cartItems: parsedCartItems,
          cartHasFreeItem,
          domains: publicDomains,
          hasFreeAddress,
          prices,
          roe,
          usersFreeAddresses,
        }),
      ),
    );

    setAdditionalItemsList(
      parsedAdditionalItemsList.map(additionalItem =>
        handleSelectedDomain({
          fchItem: additionalItem,
          cartItems: parsedCartItems,
          cartHasFreeItem,
          domains: publicDomains,
          hasFreeAddress,
          prices,
          roe,
          usersFreeAddresses,
        }),
      ),
    );

    setUsersItemsListIfChanged(
      parsedUsersItemsList.map(usersItem => {
        const costNativeFio = prices.nativeFio.address;
        const { fio, usdc } = convertFioPrices(costNativeFio, roe);

        return {
          ...usersItem,
          costNativeFio,
          costFio: fio,
          costUsdc: usdc,
          isSelected: !!parsedCartItems.find(
            cartItem => cartItem.id === usersItem.id,
          ),
        };
      }),
    );
  }, [
    setUsersItemsListIfChanged,
    loading,
    additionalItemsListJSON,
    cartItemsJSON,
    suggestedItemsListJSON,
    usersItemsListJSON,
    cartHasFreeItem,
    hasFreeAddress,
    nonPremiumPublicDomainsJSON,
    prices,
    roe,
    usersFreeAddresses,
  ]);

  return {
    additionalItemsList,
    addressValue,
    error,
    infoMessage,
    loading: loading || domainsLoading,
    suggestedItemsList,
    usersItemsList,
    setAddressValue,
    setError,
    onClick,
  };
};
