import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getDomains } from '../../../../redux/registrations/actions';

import { domains as domainsSelector } from '../../../../redux/registrations/selectors';
import { fioDomains as usersDomainsSelector } from '../../../../redux/fio/selectors';

import { FIO_ADDRESS_ALREADY_EXISTS } from '../../../../constants/errors';

import { checkAddressIsExist, validateFioAddress } from '../../../../util/fio';

type UseContextProps = {
  addressValue: string | null;
  cartItemList: any[];
  error: string | null;
  loading: boolean;
  setAddressValue: (address: string) => void;
  setError: (error: string) => void;
};

export const useContext = (): UseContextProps => {
  const domains = useSelector(domainsSelector);
  const usersDomains = useSelector(usersDomainsSelector);

  const dispatch = useDispatch();

  const [addressValue, setAddressValue] = useState<string>(null);
  const [cartItemList, setCartItemList] = useState<any>([]);
  const [error, setError] = useState<string>(null);
  const [loading, toggleLoading] = useState<boolean>(false);

  const validateAddress = useCallback(
    async (address: string) => {
      toggleLoading(true);
      const allDomains = [
        ...domains.map(domain => ({ name: domain.domain })),
        ...usersDomains.map(userDomain => ({ name: userDomain.name })),
      ];

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
            setCartItemList({ address, domain: domain.name });
          }
        }
      }

      toggleLoading(false);
    },
    [domains, usersDomains],
  );

  useEffect(() => {
    dispatch(getDomains());
  }, [dispatch]);

  useEffect(() => {
    if (addressValue) validateAddress(addressValue);
  }, [addressValue, validateAddress]);

  return {
    addressValue,
    cartItemList,
    error,
    loading,
    setAddressValue,
    setError,
  };
};
