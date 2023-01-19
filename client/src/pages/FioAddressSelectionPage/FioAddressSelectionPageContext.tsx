import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getDomains } from '../../redux/registrations/actions';

import { domains as domainsSelector } from '../../redux/registrations/selectors';
import { fioDomains as usersDomainsSelector } from '../../redux/fio/selectors';

import { FIO_ADDRESS_ALREADY_EXISTS } from '../../constants/errors';

import { checkAddressIsExist, validateFioAddress } from '../../util/fio';
import { setFioName } from '../../utils';

import { SelectedItemProps, UseContextProps } from './types';

const usersItemsList = [
  {
    id: 'helllo',
    address: 'hello',
    domain: 'domain',
    costFio: '122.34',
    costUsdc: '1.04',
    costNativeFio: 12340000,
    status: 'My Domain',
    isSelected: true,
  },
  {
    id: 'helll1o',
    address: 'hello',
    domain: 'domain',
    costFio: '132.34',
    costUsdc: '1.04',
    costNativeFio: 12340000,
    status: 'My Domain',
    isSelected: false,
  },
  {
    id: 'helllo2',
    address: 'hello',
    domain: 'domain',
    costFio: '12.34',
    costUsdc: '1.04',
    costNativeFio: 12340000,
    status: 'My Domain',
    isSelected: false,
  },
];

const suggestedItemsList = [
  {
    id: 'helll3o',
    address: 'hello',
    domain: 'domain',
    costFio: '12.34',
    costUsdc: '1.04',
    costNativeFio: 12340000,
    status: 'Free',
    isSelected: false,
  },
  {
    id: 'helllo4',
    address: 'hello',
    domain: 'domain',
    costFio: '12.34',
    costUsdc: '1.04',
    costNativeFio: 12340000,
    status: 'Premium',
    isSelected: false,
  },
  {
    id: 'helll5o',
    address: 'hello',
    domain: 'domain',
    costFio: '12.34',
    costUsdc: '1.04',
    costNativeFio: 12340000,
    status: 'Custom',
    isSelected: false,
  },
];

const additionalItemsList = [
  {
    id: 'helllo6',
    address: 'hello',
    domain: 'domain',
    costFio: '12.34',
    costUsdc: '1.04',
    costNativeFio: 12340000,
    status: 'Premium',
    isSelected: false,
  },
  {
    id: 'helllo7',
    address: 'hello',
    domain: 'domain',
    costFio: '122.34',
    costUsdc: '1.04',
    costNativeFio: 12340000,
    status: 'Custom',
    isSelected: false,
  },
  {
    id: 'helll8o',
    address: 'hello',
    domain: 'domain',
    costFio: '123.34',
    costUsdc: '13.04',
    costNativeFio: 12340000,
    status: 'Premium',
    isSelected: false,
  },
  {
    id: 'helll9o',
    address: 'hello',
    domain: 'domain',
    costFio: '12.34',
    costUsdc: '1.04',
    costNativeFio: 12340000,
    status: 'Custom',
    isSelected: false,
  },
  {
    id: 'helll10o',
    address: 'hello',
    domain: 'domain',
    costFio: '12.34',
    costUsdc: '1.04',
    costNativeFio: 12340000,
    status: 'Premium',
    isSelected: false,
  },
  {
    id: 'helllo11',
    address: 'hello',
    domain: 'domain',
    costFio: '12.34',
    costUsdc: '1.04',
    costNativeFio: 12340000,
    status: 'Custom',
    isSelected: false,
  },
];

export const useContext = (): UseContextProps => {
  const domains = useSelector(domainsSelector);
  const usersDomains = useSelector(usersDomainsSelector);

  const dispatch = useDispatch();

  const [addressValue, setAddressValue] = useState<string>(null);
  const [cartItemList, setCartItemList] = useState<SelectedItemProps[]>([]);
  const [error, setError] = useState<string>(null);
  const [loading, toggleLoading] = useState<boolean>(false);

  const validateAddress = useCallback(
    async (address: string) => {
      toggleLoading(true);
      const allDomains = [
        ...domains.map(domain => ({ name: domain.domain })),
        ...usersDomains.map(userDomain => ({ name: userDomain.name })),
      ];

      const cartItemsArr = [];

      if (allDomains.length) {
        for (const domain of allDomains) {
          const error = await validateFioAddress(address, domain.name);
          if (error) {
            setError(error);
            break;
          }

          const isAddressExist = await checkAddressIsExist(
            address,
            domain.name,
          );

          if (isAddressExist) {
            setError(FIO_ADDRESS_ALREADY_EXISTS);
            break;
          }

          if (!isAddressExist) {
            cartItemsArr.push({
              id: setFioName(address, domain.name),
              address,
              domain: domain.name,
              costFio: '12.34',
              costUsdc: '1.04',
              costNativeFio: 12340000,
              status: 'Custom',
              isSelected: false,
            });
            setCartItemList(cartItemsArr);
          }
        }
      }

      toggleLoading(false);
    },
    [domains, usersDomains],
  );

  const onClick = () => {
    // TODO: Set action
  };

  useEffect(() => {
    dispatch(getDomains());
  }, [dispatch]);

  useEffect(() => {
    setError(null);
    if (addressValue) validateAddress(addressValue);
  }, [addressValue, validateAddress]);

  return {
    additionalItemsList,
    addressValue,
    cartItemList,
    error,
    loading,
    suggestedItemsList,
    usersItemsList,
    setAddressValue,
    setError,
    onClick,
  };
};
