import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setCartItems } from '../../redux/cart/actions';

import { cartItems as cartItemsSelector } from '../../redux/cart/selectors';
import {
  prices as pricesSelector,
  roe as roeSelector,
} from '../../redux/registrations/selectors';

import { CART_ITEM_TYPE } from '../../constants/common';
import { DOMAIN_TYPE } from '../../constants/fio';
import { DOMAIN_ALREADY_EXISTS } from '../../constants/errors';

import apis from '../../api';
import useEffectOnce from '../../hooks/general';
import { convertFioPrices } from '../../util/prices';
import { checkAddressOrDomainIsExist, vaildateFioDomain } from '../../util/fio';
import { addCartItem } from '../../util/cart';

import { SearchTerm } from '../../api/responses';
import { SelectedItemProps } from '../FioAddressSelectionPage/types';
import { CartItem } from '../../types';

const DEFAULT_ADDITIONAL_ITEMS_COUNT = 10;

export type UseContextProps = {
  additionalItemsList: SelectedItemProps[];
  domainValue: string;
  error: string;
  loading: boolean;
  suggestedItem: SelectedItemProps;
  onClick: (selectedItem: CartItem) => void;
  onPeriodChange: (period: string, id: string) => void;
  setDomainValue: (domain: string) => void;
};

export const useContext = () => {
  const prices = useSelector(pricesSelector);
  const roe = useSelector(roeSelector);
  const cartItems = useSelector(cartItemsSelector);

  const dispatch = useDispatch();

  const [domainValue, setDomainValue] = useState<string>(null);
  const [error, setError] = useState<string>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [prefixesList, setPrefixesList] = useState<SearchTerm[]>([]);
  const [postfixesList, setPostfixesList] = useState<SearchTerm[]>([]);
  const [suggestedItem, setSuggestedItem] = useState<SelectedItemProps>(null);
  const [additionalItemsList, setAdditionalItemsList] = useState<
    SelectedItemProps[]
  >([]);

  const {
    nativeFio: { domain: nativeFioDomainPrice },
  } = prices;

  const { fio, usdc } = convertFioPrices(nativeFioDomainPrice, roe);

  const cartItemsJSON = JSON.stringify(cartItems);
  const prefixesListJSON = JSON.stringify(prefixesList);
  const postfixesListJSON = JSON.stringify(postfixesList);
  const additionalItemsListJSON = JSON.stringify(additionalItemsList);

  const getPrefixPostfixList = async () => {
    setLoading(true);

    try {
      const {
        searchPrefixes,
        searchPostfixes,
      } = await apis.registration.prefixPostfixList();

      setPrefixesList(searchPrefixes);
      setPostfixesList(searchPostfixes);
    } catch (e) {
      //
    }

    setLoading(false);
  };

  const onClick = (selectedItem: CartItem) => {
    addCartItem(selectedItem);
  };

  const onPeriodChange = (period: string, id: string) => {
    if (suggestedItem?.id === id) {
      if (suggestedItem.period === Number(period)) return;

      setSuggestedItem({ ...suggestedItem, period: Number(period) });
    }

    const existingAdditionalItem = additionalItemsList.find(
      additionalItem => additionalItem.id,
    );

    if (existingAdditionalItem) {
      if (existingAdditionalItem.period === Number(period)) return;

      setAdditionalItemsList(
        additionalItemsList.map(additionalItem =>
          additionalItem.id === id
            ? { ...additionalItem, period: Number(period) }
            : additionalItem,
        ),
      );
    }

    const parsedCartItems: CartItem[] = JSON.parse(cartItemsJSON);
    const existingCartItem = parsedCartItems.find(
      cartItem => cartItem.id === id,
    );

    if (existingCartItem) {
      if (existingCartItem.period === Number(period)) return;

      dispatch(
        setCartItems(
          parsedCartItems.map(cartItem =>
            cartItem.id === id
              ? { ...cartItem, period: Number(period) }
              : cartItem,
          ),
        ),
      );
    }
  };

  const handleDomainItem = useCallback(
    async (domainItem: { name: string; rank?: number }) => {
      const { name, rank } = domainItem;

      const isDomainExist = await checkAddressOrDomainIsExist({ domain: name });

      const parsedCartItems: CartItem[] = JSON.parse(cartItemsJSON);

      const existingCartItem = parsedCartItems.find(
        cartItem => cartItem.id === name,
      );

      return {
        id: name,
        domain: name,
        costFio: fio,
        costUsdc: usdc,
        costNativeFio: nativeFioDomainPrice,
        domainType: DOMAIN_TYPE.CUSTOM,
        isSelected: !!existingCartItem,
        isExist: isDomainExist,
        period: existingCartItem ? existingCartItem.period : 1,
        type: CART_ITEM_TYPE.DOMAIN,
        rank: rank || 0,
      };
    },
    [cartItemsJSON, fio, nativeFioDomainPrice, usdc],
  );

  const handleSuggestedItem = useCallback(
    async (domain: string) => {
      setLoading(true);

      const error = vaildateFioDomain(domain);

      if (error) {
        setError(error);
        return;
      }

      const suggestedItemElement = await handleDomainItem({
        name: domain,
      });

      if (suggestedItemElement.isExist) {
        setError(DOMAIN_ALREADY_EXISTS);
      }

      setSuggestedItem(suggestedItemElement);

      setLoading(false);
    },
    [handleDomainItem],
  );

  const validateDomainItems = useCallback(
    async (domainArr: Partial<SearchTerm> & { name: string }[]) =>
      await Promise.all(
        domainArr.map(async domain => {
          const error = vaildateFioDomain(domain.name);

          if (!error) return await handleDomainItem(domain);

          return null;
        }),
      ),
    [handleDomainItem],
  );

  const handleAdditionalItemsList = useCallback(
    async (domain: string) => {
      if (error && error !== DOMAIN_ALREADY_EXISTS) return;
      setLoading(true);

      const parsedPrexiesList: SearchTerm[] = JSON.parse(prefixesListJSON);
      const parsedPostfixesList: SearchTerm[] = JSON.parse(postfixesListJSON);

      const prefixedDomains = parsedPrexiesList
        .filter(prefixesItem => {
          const { term } = prefixesItem;

          const regex = new RegExp(`^${term}`, 'i');

          return !regex.test(domain);
        })
        .map(prefixItem => ({ ...prefixItem, name: prefixItem.term + domain }));

      const postfixedDomains = parsedPostfixesList
        .filter(postfixesItem => {
          const { term } = postfixesItem;

          const regex = new RegExp(`${term}$`, 'i');

          return !regex.test(domain);
        })
        .map(postfixItem => ({
          ...postfixItem,
          name: domain + postfixItem.term,
        }));

      const validatedPrefixedItems = await validateDomainItems(prefixedDomains);
      const validatedPostfixedItems = await validateDomainItems(
        postfixedDomains,
      );

      const availablePrefixedItems = validatedPrefixedItems
        .filter(Boolean)
        .filter(prefixedDomain => !prefixedDomain?.isExist);
      const availablePostfixedItems = validatedPostfixedItems
        .filter(Boolean)
        .filter(postfixedDomain => !postfixedDomain?.isExist);

      setAdditionalItemsList(
        [...availablePrefixedItems, ...availablePostfixedItems]
          .sort((a, b) => a.rank - b.rank)
          .slice(0, DEFAULT_ADDITIONAL_ITEMS_COUNT),
      );

      setLoading(false);
    },
    [error, postfixesListJSON, prefixesListJSON, validateDomainItems],
  );

  useEffectOnce(() => {
    getPrefixPostfixList();
  }, []);

  useEffect(() => {
    setError(null);
    handleSuggestedItem(domainValue);
    handleAdditionalItemsList(domainValue);
  }, [domainValue, handleAdditionalItemsList, handleSuggestedItem]);

  useEffect(() => {
    if (loading) return;

    const parsedCartItems: CartItem[] = JSON.parse(cartItemsJSON);
    const parsedAdditionalItemsList: SelectedItemProps[] = JSON.parse(
      additionalItemsListJSON,
    );

    setAdditionalItemsList(
      parsedAdditionalItemsList.map(additionalItem =>
        parsedCartItems.find(cartItem => cartItem.id === additionalItem.id)
          ? { ...additionalItem, isSelected: true }
          : { ...additionalItem, isSelected: false },
      ),
    );
  }, [loading, additionalItemsListJSON, cartItemsJSON]);

  return {
    additionalItemsList,
    domainValue,
    error,
    loading,
    suggestedItem,
    onClick,
    onPeriodChange,
    setDomainValue,
  };
};
