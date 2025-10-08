import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  addItem as addItemToCart,
  updateCartItemPeriod,
} from '../../redux/cart/actions';

import { cartItems as cartItemsSelector } from '../../redux/cart/selectors';
import {
  prices as pricesSelector,
  roe as roeSelector,
} from '../../redux/registrations/selectors';
import { refProfileCode } from '../../redux/refProfile/selectors';

import {
  CART_ITEM_TYPE,
  DEFAULT_CART_ITEM_PERIOD_OPTION,
} from '../../constants/common';
import { DOMAIN_TYPE } from '../../constants/fio';
import { DOMAIN_ALREADY_EXISTS } from '../../constants/errors';

import apis from '../../api';
import useEffectOnce from '../../hooks/general';
import {
  convertFioPrices,
  handleFullPriceForMultiYearItems,
} from '../../util/prices';
import {
  checkAddressOrDomainIsExist,
  checkIsDomainItemExistsOnCart,
  validateFioDomain,
} from '../../util/fio';
import MathOp from '../../util/math';
import { fireAnalyticsEventDebounced } from '../../util/analytics';

import { SearchTerm } from '../../api/responses';
import { SelectedItemProps } from '../FioAddressSelectionPage/types';
import { CartItem, NativePrices, Roe } from '../../types';

const DEFAULT_ADDITIONAL_ITEMS_COUNT = 5;

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

const handleDomainItem = async ({
  domainItem,
  cartItemsJSON,
  prices,
  roe,
}: {
  domainItem: { name: string; rank?: number };
  cartItemsJSON: string;
  prices: NativePrices;
  roe: Roe;
}) => {
  const { name, rank } = domainItem;

  const parsedCartItems: CartItem[] = JSON.parse(cartItemsJSON);
  const existingCartItem = parsedCartItems.find(cartItem =>
    checkIsDomainItemExistsOnCart(name, cartItem),
  );
  const period = existingCartItem
    ? Number(existingCartItem.period)
    : parseFloat(DEFAULT_CART_ITEM_PERIOD_OPTION.id);

  const {
    fio: costFio,
    usdc: costUsdc,
    costNativeFio,
  } = handleFullPriceForMultiYearItems({
    prices,
    period,
    roe,
    includeAddress: existingCartItem?.type === CART_ITEM_TYPE.ADDRESS,
  });

  const isDomainExist = await checkAddressOrDomainIsExist({
    domain: name,
    fireAnalytics: fireAnalyticsEventDebounced,
  });

  return {
    id: name,
    domain: name,
    costFio,
    costUsdc,
    costNativeFio,
    domainType: DOMAIN_TYPE.CUSTOM,
    isSelected: !!existingCartItem,
    isExist: isDomainExist,
    period,
    type: CART_ITEM_TYPE.DOMAIN,
    rank: rank || 0,
  };
};

const validateDomainItems = async ({
  domainArr,
  cartItemsJSON,
  prices,
  roe,
}: {
  domainArr: Partial<SearchTerm> & { name: string }[];
  cartItemsJSON: string;
  prices: NativePrices;
  roe: Roe;
}) =>
  (
    await Promise.all(
      domainArr.map(async domain => {
        const error = validateFioDomain(domain.name);

        if (!error)
          return await handleDomainItem({
            domainItem: domain,
            cartItemsJSON,
            prices,
            roe,
          });

        return null;
      }),
    )
  ).filter(Boolean);

export const useContext = (): UseContextProps => {
  const prices = useSelector(pricesSelector);
  const refCode = useSelector(refProfileCode);
  const roe = useSelector(roeSelector);
  const cartItems = useSelector(cartItemsSelector);

  const dispatch = useDispatch();

  const [domainValue, setDomainValue] = useState<string>(null);
  const [error, setError] = useState<string>(null);
  const [loading, toggleLoading] = useState<boolean>(false);
  const [prefixPostfixListLoading, togglePrefixPostfixListLoading] = useState<
    boolean
  >(false);
  const [prefixesList, setPrefixesList] = useState<SearchTerm[]>([]);
  const [postfixesList, setPostfixesList] = useState<SearchTerm[]>([]);
  const [suggestedItem, setSuggestedItem] = useState<SelectedItemProps>(null);
  const [additionalItemsList, setAdditionalItemsList] = useState<
    SelectedItemProps[]
  >([]);
  const [previousDomainValue, setPreviousDomainValue] = useState<string>(null);

  const cartItemsJSON = JSON.stringify(cartItems);
  const prefixesListJSON = JSON.stringify(prefixesList);
  const postfixesListJSON = JSON.stringify(postfixesList);
  const additionalItemsListJSON = JSON.stringify(additionalItemsList);
  const suggestedItemJSON = JSON.stringify(suggestedItem);

  const getPrefixPostfixList = async () => {
    togglePrefixPostfixListLoading(true);

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

    togglePrefixPostfixListLoading(false);
  };

  const onClick = useCallback(
    (selectedItem: CartItem) => {
      dispatch(
        addItemToCart({
          item: selectedItem,
          refCode,
        }),
      );
    },
    [dispatch, refCode],
  );

  const onPeriodChange = (period: string, id: string) => {
    const periodNumber = new MathOp(period).toNumber();
    if (suggestedItem?.id === id) {
      if (suggestedItem.period === periodNumber) return;

      const {
        fio: costFio,
        usdc: costUsdc,
        costNativeFio,
      } = handleFullPriceForMultiYearItems({
        prices: prices?.nativeFio,
        period: periodNumber,
        roe,
      });

      setSuggestedItem({
        ...suggestedItem,
        period: periodNumber,
        costFio,
        costUsdc,
        costNativeFio,
      });
    }

    const existingAdditionalItem = additionalItemsList.find(
      additionalItem => additionalItem.id === id,
    );

    if (existingAdditionalItem) {
      if (existingAdditionalItem.period === periodNumber) return;

      const fioPrices = convertFioPrices(
        new MathOp(existingAdditionalItem.costNativeFio).mul(period).toString(),
        roe,
      );
      setAdditionalItemsList(
        additionalItemsList.map(additionalItem =>
          additionalItem.id === id
            ? {
                ...additionalItem,
                period: periodNumber,
                costFio: fioPrices.fio,
                costUsdc: fioPrices.usdc,
              }
            : additionalItem,
        ),
      );
    }

    const parsedCartItems: CartItem[] = JSON.parse(cartItemsJSON);
    const existingCartItem = parsedCartItems.find(cartItem =>
      checkIsDomainItemExistsOnCart(id, cartItem),
    );

    if (existingCartItem) {
      if (existingCartItem.period === periodNumber) return;

      dispatch(
        updateCartItemPeriod({
          itemId: existingCartItem.id,
          item: existingCartItem,
          period: periodNumber,
        }),
      );
    }
  };

  const handleSelectedItems = useCallback(
    async (domain: string) => {
      if (!domain) {
        setSuggestedItem(null);
        setAdditionalItemsList([]);
        setError(null);
        return;
      }

      if (previousDomainValue === domain) return;

      setError(null);

      toggleLoading(true);

      const validationError = validateFioDomain(domain);

      if (validationError) {
        setError(validationError);
        toggleLoading(false);
        setPreviousDomainValue(domain);
        return;
      }

      const suggestedItemElement = await handleDomainItem({
        domainItem: {
          name: domain,
        },
        cartItemsJSON,
        prices: prices?.nativeFio,
        roe,
      });

      if (suggestedItemElement.isExist) {
        setError(DOMAIN_ALREADY_EXISTS);
      } else {
        setSuggestedItem(suggestedItemElement);
      }

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

      const validatedPrefixedItems = await validateDomainItems({
        domainArr: prefixedDomains,
        cartItemsJSON,
        prices: prices?.nativeFio,
        roe,
      });
      const validatedPostfixedItems = await validateDomainItems({
        domainArr: postfixedDomains,
        cartItemsJSON,
        prices: prices?.nativeFio,
        roe,
      });

      const availablePrefixedItems = validatedPrefixedItems
        .filter(prefixedDomain => !prefixedDomain?.isExist)
        .sort((a, b) => a.rank - b.rank)
        .slice(0, DEFAULT_ADDITIONAL_ITEMS_COUNT);
      const availablePostfixedItems = validatedPostfixedItems
        .filter(postfixedDomain => !postfixedDomain?.isExist)
        .sort((a, b) => a.rank - b.rank)
        .slice(0, DEFAULT_ADDITIONAL_ITEMS_COUNT);

      setAdditionalItemsList([
        ...availablePrefixedItems,
        ...availablePostfixedItems,
      ]);

      setPreviousDomainValue(domain);

      toggleLoading(false);
    },
    [
      cartItemsJSON,
      postfixesListJSON,
      prefixesListJSON,
      previousDomainValue,
      prices?.nativeFio,
      roe,
    ],
  );

  useEffectOnce(() => {
    getPrefixPostfixList();
  }, []);

  useEffect(() => {
    if (prefixPostfixListLoading) return;
    handleSelectedItems(domainValue);
  }, [domainValue, prefixPostfixListLoading, handleSelectedItems]);

  useEffect(() => {
    if (loading) return;

    const parsedCartItems: CartItem[] = JSON.parse(cartItemsJSON);
    const parsedAdditionalItemsList: SelectedItemProps[] = JSON.parse(
      additionalItemsListJSON,
    );
    const parsedSuggestedItem: SelectedItemProps = JSON.parse(
      suggestedItemJSON,
    );

    if (parsedSuggestedItem?.id) {
      const existingCartItemSuggested = parsedCartItems.find(cartItem =>
        checkIsDomainItemExistsOnCart(parsedSuggestedItem.id, cartItem),
      );

      setSuggestedItem({
        ...parsedSuggestedItem,
        period: existingCartItemSuggested
          ? existingCartItemSuggested.period
          : parsedSuggestedItem.period,
        isSelected: !!existingCartItemSuggested,
      });
    }

    setAdditionalItemsList(
      parsedAdditionalItemsList.map(additionalItem => {
        const existingCartItem = parsedCartItems.find(cartItem =>
          checkIsDomainItemExistsOnCart(additionalItem.id, cartItem),
        );
        return existingCartItem
          ? {
              ...additionalItem,
              isSelected: true,
              period: existingCartItem.period,
            }
          : { ...additionalItem, isSelected: false };
      }),
    );
  }, [loading, additionalItemsListJSON, cartItemsJSON, suggestedItemJSON]);

  return {
    additionalItemsList,
    domainValue,
    error,
    loading: loading || prefixPostfixListLoading,
    suggestedItem,
    onClick,
    onPeriodChange,
    setDomainValue,
  };
};
