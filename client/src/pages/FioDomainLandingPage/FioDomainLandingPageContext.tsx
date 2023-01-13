import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { ROUTES } from '../../constants/routes';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';

import {
  prices as pricesSelector,
  roe as roeSelector,
} from '../../redux/registrations/selectors';
import { convertFioPrices } from '../../util/prices';

import { FormValues } from '../../components/FioDomainWidget/types';

export const useContext = () => {
  const history = useHistory();
  const onSubmit = (values: FormValues) => {
    let domainSelectionRoute = ROUTES.FIO_DOMAINS_SELECTION;

    if (values.domain) {
      domainSelectionRoute += `?${QUERY_PARAMS_NAMES.DOMAIN}=${values.domain}`;
    }

    history.push(domainSelectionRoute);
  };

  const roe = useSelector(roeSelector);
  const prices = useSelector(pricesSelector);
  const domainPrice = convertFioPrices(prices.nativeFio.domain, roe).usdc;

  return { onSubmit, domainPrice };
};
