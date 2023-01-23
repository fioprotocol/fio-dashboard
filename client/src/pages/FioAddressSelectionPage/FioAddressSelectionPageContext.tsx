import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { refreshFioNames } from '../../redux/fio/actions';
import { getDomains } from '../../redux/registrations/actions';

import { cartItems as cartItemsSelector } from '../../redux/cart/selectors';
import { fioWallets as fioWalletsSelector } from '../../redux/fio/selectors';
import {
  allDomains as allDomainsSelector,
  loading as domainsLoaingSelector,
  prices as pricesSelector,
  roe as roeSelector,
} from '../../redux/registrations/selectors';
import { hasFreeAddress as hasFreeAddressSelector } from '../../redux/profile/selectors';

import { FIO_ADDRESS_ALREADY_EXISTS } from '../../constants/errors';
import { DOMAIN_TYPE } from '../../constants/fio';
import { CART_ITEM_TYPE } from '../../constants/common';

import { addCartItem } from '../../util/cart';
import { checkAddressIsExist, validateFioAddress } from '../../util/fio';
import MathOp from '../../util/math';
import { convertFioPrices } from '../../util/prices';
import { setFioName } from '../../utils';

import {
  DomainsArrItemType,
  SelectedItemProps,
  UseContextProps,
} from './types';
import { AdminDomain } from '../../api/responses';
import { CartItem, Prices } from '../../types';

const ADDITIONAL_DOMAINS_COUNT_LIMIT = 25;
const USER_DOMAINS_LIMIT = 3;
const DEFAULT_DOMAIN_TYPE_LIMIT = 5;

const handleFCHItems = async ({
  domainArr,
  address,
  prices,
  roe,
  setError,
}: {
  domainArr: DomainsArrItemType;
  address: string;
  prices: Prices;
  roe: number;
  setError: (error: string) => void;
}) => {
  const {
    nativeFio: { address: natvieFioAddressPrice, domain: nativeFioDomainPrice },
  } = prices;

  return (
    await Promise.all(
      domainArr.map(async domain => {
        const error = await validateFioAddress(address, domain.name);
        if (error) {
          setError(error);
          return;
        }

        const isAddressExist = await checkAddressIsExist(address, domain.name);

        const isCustomDomain = domain.domainType === DOMAIN_TYPE.CUSTOM;

        const totalNativeFio = isCustomDomain
          ? new MathOp(natvieFioAddressPrice)
              .add(nativeFioDomainPrice)
              .toNumber()
          : natvieFioAddressPrice;

        const { fio, usdc } = convertFioPrices(totalNativeFio, roe);

        return {
          id: setFioName(address, domain.name),
          address,
          domain: domain.name,
          costFio: fio,
          costUsdc: usdc,
          costNativeFio: totalNativeFio,
          domainType: domain.domainType,
          isSelected: false,
          isExist: isAddressExist,
          period: 1,
          type: isCustomDomain
            ? CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN
            : CART_ITEM_TYPE.ADDRESS,
          allowFree: domain.allowFree,
        };
      }),
    )
  ).filter(Boolean);
};

export const useContext = (): UseContextProps => {
  const allDomains = useSelector(allDomainsSelector);
  const hasFreeAddress = useSelector(hasFreeAddressSelector);
  const domainsLoaing = useSelector(domainsLoaingSelector);
  const fioWallets = useSelector(fioWalletsSelector);
  const prices = useSelector(pricesSelector);
  const roe = useSelector(roeSelector);
  const cartItems = useSelector(cartItemsSelector);

  const dispatch = useDispatch();

  const {
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

  const cartHasFreeItem = cartItems.some(
    cartItem => cartItem.domainType === DOMAIN_TYPE.FREE,
  );

  const publicDomains: Partial<AdminDomain>[] = refProfileDomains.length
    ? refProfileDomains
    : dashboardDomains;

  const sortedUserDomains = userDomains
    .map(userDomain => ({
      name: userDomain.name,
      domainType: DOMAIN_TYPE.USERS,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const nonPremiumPublicDomains = publicDomains
    .filter(publicDomain => !publicDomain.isPremium)
    .map(publicDomain => ({
      name: publicDomain.name,
      domainType:
        hasFreeAddress || cartHasFreeItem
          ? DOMAIN_TYPE.PREMIUM
          : DOMAIN_TYPE.FREE,
      rank: publicDomain.rank || 0,
      allowFree: true,
    }))
    .sort((a, b) => b.rank - a.rank);

  const premiumPublicDomains = publicDomains
    .filter(publicDomain => publicDomain.isPremium)
    .map(publicDomain => ({
      name: publicDomain.name,
      domainType: DOMAIN_TYPE.PREMIUM,
      rank: publicDomain.rank,
    }))
    .sort((a, b) => b.rank - a.rank);

  const customDomains = usernamesOnCustomDomains
    .map(customDomain => ({
      name: customDomain.username,
      domainType: DOMAIN_TYPE.CUSTOM,
      rank: customDomain.rank,
    }))
    .sort((a, b) => b.rank - a.rank);

  const userDomainsJSON = JSON.stringify(sortedUserDomains);
  const nonPremiumPublicDomainsJSON = JSON.stringify(nonPremiumPublicDomains);
  const premiumPublicDomainsJSON = JSON.stringify(premiumPublicDomains);
  const customDomainsJSON = JSON.stringify(customDomains);
  const cartItemsJSON = JSON.stringify(cartItems);
  const additionalItemsListJSON = JSON.stringify(additionalItemsList);
  const suggestedItemsListJSON = JSON.stringify(suggestedItemsList);
  const usersItemsListJSON = JSON.stringify(usersItemsList);

  const validateAddress = useCallback(
    async (address: string) => {
      toggleLoading(true);

      if (!address) {
        setAdditionalItemsList([]);
        setSuggestedItemsList([]);
        setUsersItemsList([]);
        return;
      }

      const parsedUsersDomains = JSON.parse(userDomainsJSON);
      const parsedNonPremiumDomains = JSON.parse(nonPremiumPublicDomainsJSON);
      const parsedPremiumDomains = JSON.parse(premiumPublicDomainsJSON);
      const parsedCustomDomains = JSON.parse(customDomainsJSON);

      const defaultParams = { address, prices, roe, setError };

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

      const userFCHAllExist =
        validatedUserFCH.length &&
        validatedUserFCH.every(userFCH => userFCH.isExist);

      const nonPremiumFCHAllExist =
        validatedNonPremiumFCH.length &&
        validatedNonPremiumFCH.every(nonPremiumFCH => nonPremiumFCH.isExist);

      const premiumFCHAllExist =
        validatedPremiumFCH.length &&
        validatedPremiumFCH.every(premiumFCH => premiumFCH.isExist);

      const customFCHAllExist =
        validatedCustomFCH.length &&
        validatedCustomFCH.every(customFCH => customFCH.isExist);

      if (
        userFCHAllExist &&
        nonPremiumFCHAllExist &&
        premiumFCHAllExist &&
        customFCHAllExist
      ) {
        setError(FIO_ADDRESS_ALREADY_EXISTS);
        setAdditionalItemsList([]);
        setSuggestedItemsList([]);
        setUsersItemsList([]);
        return;
      }

      if (userFCHAllExist) {
        setUsersItemsList([]);
      } else {
        setUsersItemsList(
          validatedUserFCH
            .filter(userFCH => !userFCH.isExist)
            .slice(0, USER_DOMAINS_LIMIT),
        );
      }

      if (nonPremiumFCHAllExist && premiumFCHAllExist && customFCHAllExist) {
        setAdditionalItemsList([]);
        setSuggestedItemsList([]);
        return;
      }

      let suggestedPublicDomains: SelectedItemProps[] = [];
      let additionalPublicDomains: SelectedItemProps[] = [];

      if (!nonPremiumFCHAllExist) {
        suggestedPublicDomains = [
          ...suggestedPublicDomains,
          ...validatedNonPremiumFCH
            .filter(nonPremiumFCH => !nonPremiumFCH.isExist)
            .slice(0, DEFAULT_DOMAIN_TYPE_LIMIT),
        ];
        additionalPublicDomains = [
          ...additionalPublicDomains,
          ...validatedNonPremiumFCH
            .filter(nonPremiumFCH => !nonPremiumFCH.isExist)
            .slice(DEFAULT_DOMAIN_TYPE_LIMIT),
        ];
      }

      if (!premiumFCHAllExist) {
        suggestedPublicDomains = [
          ...suggestedPublicDomains,
          ...validatedPremiumFCH
            .filter(premiumFCH => !premiumFCH.isExist)
            .slice(0, DEFAULT_DOMAIN_TYPE_LIMIT),
        ];
        additionalPublicDomains = [
          ...additionalPublicDomains,
          ...validatedPremiumFCH
            .filter(premiumFCH => !premiumFCH.isExist)
            .slice(DEFAULT_DOMAIN_TYPE_LIMIT),
        ];
      }

      if (!customFCHAllExist) {
        suggestedPublicDomains = [
          ...suggestedPublicDomains,
          ...validatedCustomFCH
            .filter(customFCH => !customFCH.isExist)
            .slice(0, DEFAULT_DOMAIN_TYPE_LIMIT),
        ];
        additionalPublicDomains = [
          ...additionalPublicDomains,
          ...validatedCustomFCH
            .filter(customFCH => !customFCH.isExist)
            .slice(DEFAULT_DOMAIN_TYPE_LIMIT),
        ];
      }

      setAdditionalItemsList(
        additionalPublicDomains.slice(0, ADDITIONAL_DOMAINS_COUNT_LIMIT),
      );
      setSuggestedItemsList(suggestedPublicDomains);
      toggleLoading(false);
    },
    [
      customDomainsJSON,
      nonPremiumPublicDomainsJSON,
      premiumPublicDomainsJSON,
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
    setError(null);
    validateAddress(addressValue);
  }, [addressValue, validateAddress]);

  useEffect(() => {
    for (const fioWallet of fioWallets) {
      dispatch(refreshFioNames(fioWallet.publicKey));
    }
  }, [dispatch, fioWallets]);

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

    setAdditionalItemsList(
      parsedAdditionalItemsList.map(additionalItem =>
        parsedCartItems.find(cartItem => cartItem.id === additionalItem.id)
          ? { ...additionalItem, isSelected: true }
          : { ...additionalItem, isSelected: false },
      ),
    );

    setSuggestedItemsList(
      parsedSuggestedItemsList.map(suggestedItem =>
        parsedCartItems.find(cartItem => cartItem.id === suggestedItem.id)
          ? { ...suggestedItem, isSelected: true }
          : { ...suggestedItem, isSelected: false },
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
  ]);

  return {
    additionalItemsList,
    addressValue,
    error,
    loading: loading || domainsLoaing,
    suggestedItemsList,
    usersItemsList,
    setAddressValue,
    setError,
    onClick,
  };
};
