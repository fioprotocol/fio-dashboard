import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { refreshFioNames } from '../../redux/fio/actions';
import { getDomains } from '../../redux/registrations/actions';

import { fioWallets as fioWalletsSelector } from '../../redux/fio/selectors';
import {
  allDomains as allDomainsSelector,
  loading as domainsLoaingSelector,
} from '../../redux/registrations/selectors';
import { hasFreeAddress as hasFreeAddressSelector } from '../../redux/profile/selectors';

import { FIO_ADDRESS_ALREADY_EXISTS } from '../../constants/errors';
import { DOMAIN_TYPE } from '../../constants/fio';

import { checkAddressIsExist, validateFioAddress } from '../../util/fio';
import { setFioName } from '../../utils';

import {
  DomainsArrItemType,
  SelectedItemProps,
  UseContextProps,
} from './types';
import { AdminDomain } from '../../api/responses';

const ADDITIONAL_DOMAINS_COUNT_LIMIT = 25;
const DEFAULT_DOMAIN_TYPE_LIMIT = 5;

const handleFCHItems = async ({
  domainArr,
  address,
  setError,
  addFCHItem,
}: {
  domainArr: DomainsArrItemType;
  address: string;
  setError: (error: string) => void;
  addFCHItem: (fchItem: SelectedItemProps[]) => void;
}) => {
  const itemslist = [];

  for (const domain of domainArr) {
    if (itemslist.length > ADDITIONAL_DOMAINS_COUNT_LIMIT) break;

    const error = await validateFioAddress(address, domain.name);
    if (error) {
      setError(error);
      break;
    }

    const isAddressExist = await checkAddressIsExist(address, domain.name);

    if (isAddressExist) {
      setError(FIO_ADDRESS_ALREADY_EXISTS);
      break;
    }

    if (!isAddressExist) {
      itemslist.push({
        id: setFioName(address, domain.name),
        address,
        domain: domain.name,
        costFio: '12.34',
        costUsdc: '1.04',
        costNativeFio: 12340000,
        domainType: domain.domainType,
        isSelected: false,
      });
    }
  }
  itemslist.length > 0 && addFCHItem(itemslist);
};

export const useContext = (): UseContextProps => {
  const allDomains = useSelector(allDomainsSelector);
  const hasFreeAddress = useSelector(hasFreeAddressSelector);
  const domainsLoaing = useSelector(domainsLoaingSelector);
  const fioWallets = useSelector(fioWalletsSelector);

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

      const parsedNonPremiumDomains = JSON.parse(nonPremiumPublicDomainsJSON);
      const parsedPremiumDomains = JSON.parse(premiumPublicDomainsJSON);
      const parsedCustomDomains = JSON.parse(customDomainsJSON);

      const suggestedPublicDomains = [
        ...parsedNonPremiumDomains.slice(0, DEFAULT_DOMAIN_TYPE_LIMIT),
        ...parsedPremiumDomains.slice(0, DEFAULT_DOMAIN_TYPE_LIMIT),
        ...parsedCustomDomains.slice(0, DEFAULT_DOMAIN_TYPE_LIMIT),
      ];

      const additionalPublicDomains = [
        ...parsedNonPremiumDomains.slice(DEFAULT_DOMAIN_TYPE_LIMIT),
        ...parsedPremiumDomains.slice(DEFAULT_DOMAIN_TYPE_LIMIT),
        ...parsedCustomDomains.slice(DEFAULT_DOMAIN_TYPE_LIMIT),
      ];

      if (userDomains?.length) {
        await handleFCHItems({
          domainArr: userDomains
            .map(userDomain => ({
              name: userDomain.name,
              domainType: DOMAIN_TYPE.USERS,
            }))
            .sort((a, b) => a.name.localeCompare(b.name))
            .slice(0, 3),
          address,
          setError,
          addFCHItem: setUsersItemsList,
        });
      }

      if (suggestedPublicDomains.length) {
        await handleFCHItems({
          domainArr: suggestedPublicDomains,
          address,
          setError,
          addFCHItem: setSuggestedItemsList,
        });
      }

      if (additionalPublicDomains.length) {
        await handleFCHItems({
          domainArr: additionalPublicDomains,
          address,
          setError,
          addFCHItem: setAdditionalItemsList,
        });
      }

      toggleLoading(false);
    },
    [
      customDomainsJSON,
      nonPremiumPublicDomainsJSON,
      premiumPublicDomainsJSON,
      userDomains,
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
