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
import { refProfileCode } from '../../redux/refProfile/selectors';

import { handleFullPriceForMultiYearItems } from '../../util/prices';

import { FormValues } from '../../components/FioDomainWidget/types';
import { AnyObject } from '../../types';
import { DEFAULT_CART_ITEM_PERIOD_OPTION } from '../../constants/common';
import { AdminDomain } from '../../api/responses';

export const useContext = (): {
  onSubmit: (values: FormValues) => void;
  domainPrice: string;
  availableDomains: AdminDomain[];
  openseaDomains: AnyObject[];
} => {
  const history = useHistory();
  const dispatch = useDispatch();

  const domains = useSelector(registrationDomainsSelector);
  const refCode = useSelector(refProfileCode);
  const roe = useSelector(roeSelector);
  const prices = useSelector(pricesSelector);

  const period = parseFloat(DEFAULT_CART_ITEM_PERIOD_OPTION.id);

  const { usdc: domainPrice } = handleFullPriceForMultiYearItems({
    prices: prices?.nativeFio,
    period,
    roe,
  });

  useEffectOnce(() => {
    dispatch(getDomains({ refCode }));
  }, []);

  const onSubmit = (values: FormValues): void => {
    let domainSelectionRoute = ROUTES.FIO_DOMAINS_SELECTION;

    if (values.domain) {
      domainSelectionRoute += `?${QUERY_PARAMS_NAMES.DOMAIN}=${values.domain}`;
    }

    history.push(domainSelectionRoute);
  };

  return {
    onSubmit,
    domainPrice,
    availableDomains: domains?.availableDomains || [],
    openseaDomains: [] as AnyObject[],
  };
};
