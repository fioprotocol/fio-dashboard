import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { refreshFioNames } from '../../redux/fio/actions';
import { getDomains } from '../../redux/registrations/actions';

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
import { Prices } from '../../types';

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
  const itemslist = [];

  const {
    nativeFio: { address: natvieFioAddressPrice, domain: nativeFioDomainPrice },
  } = prices;

  for (const domain of domainArr) {
    const error = await validateFioAddress(address, domain.name);
    if (error) {
      setError(error);
      break;
    }

    const isAddressExist = await checkAddressIsExist(address, domain.name);

    const totalNativeFio =
      domain.domainType === DOMAIN_TYPE.CUSTOM
        ? new MathOp(natvieFioAddressPrice).add(nativeFioDomainPrice).toNumber()
        : natvieFioAddressPrice;

    const { fio, usdc } = convertFioPrices(totalNativeFio, roe);

    itemslist.push({
      id: setFioName(address, domain.name),
      address,
      domain: domain.name,
      costFio: fio,
      costUsdc: usdc,
      costNativeFio: totalNativeFio,
      domainType: domain.domainType,
      isSelected: false,
      isExist: isAddressExist,
    });
  }

  return itemslist;
};

export const useContext = (): UseContextProps => {
  const allDomains = useSelector(allDomainsSelector);
  const hasFreeAddress = useSelector(hasFreeAddressSelector);
  const domainsLoaing = useSelector(domainsLoaingSelector);
  const fioWallets = useSelector(fioWalletsSelector);
  const prices = useSelector(pricesSelector);
  const roe = useSelector(roeSelector);

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
      domainType: hasFreeAddress ? DOMAIN_TYPE.PREMIUM : DOMAIN_TYPE.FREE,
      rank: publicDomain.rank || 0,
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

      const validatedUserFCH = await handleFCHItems({
        domainArr: parsedUsersDomains,
        ...defaultParams,
      });

      const validatedNonPremiumFCH = await handleFCHItems({
        domainArr: parsedNonPremiumDomains,
        ...defaultParams,
      });

      const validatedPremiumFCH = await handleFCHItems({
        domainArr: parsedPremiumDomains,
        ...defaultParams,
      });

      const validatedCustomFCH = await handleFCHItems({
        domainArr: parsedCustomDomains,
        ...defaultParams,
      });

      const userFCHAllExist = validatedUserFCH.every(
        userFCH => userFCH.isExist,
      );
      const nonPremiumFCHAllExist = validatedNonPremiumFCH.every(
        nonPremiumFCH => nonPremiumFCH.isExist,
      );
      const premiumFCHAllExist = validatedPremiumFCH.every(
        premiumFCH => premiumFCH.isExist,
      );
      const customFCHAllExist = validatedCustomFCH.every(
        customFCH => customFCH.isExist,
      );

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

      setSuggestedItemsList(suggestedPublicDomains);
      setAdditionalItemsList(
        additionalPublicDomains.slice(0, ADDITIONAL_DOMAINS_COUNT_LIMIT),
      );

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

  const onClick = () => {
    // TODO: Set action
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
