import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { ROUTES } from '../../constants/routes';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';

import useEffectOnce from '../../hooks/general';

import { getDomains } from '../../redux/registrations/actions';

import {
  prices as pricesSelector,
  roe as roeSelector,
  registrationDomains as registrationDomainsSelector,
} from '../../redux/registrations/selectors';
import { convertFioPrices } from '../../util/prices';

import { FormValues } from '../../components/FioDomainWidget/types';
import { AnyObject } from '../../types';

export const useContext = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  useEffectOnce(() => {
    dispatch(getDomains());
  }, []);

  const onSubmit = (values: FormValues) => {
    let domainSelectionRoute = ROUTES.FIO_DOMAINS_SELECTION;

    if (values.domain) {
      domainSelectionRoute += `?${QUERY_PARAMS_NAMES.DOMAIN}=${values.domain}`;
    }

    history.push(domainSelectionRoute);
  };

  const roe = useSelector(roeSelector);
  const prices = useSelector(pricesSelector);
  const domains = useSelector(registrationDomainsSelector);
  const domainPrice = convertFioPrices(prices?.nativeFio.domain, roe).usdc;

  return {
    onSubmit,
    domainPrice,
    availableDomains: domains?.availableDomains || [],
    openseaDomains: [] as AnyObject[],
  };
};
