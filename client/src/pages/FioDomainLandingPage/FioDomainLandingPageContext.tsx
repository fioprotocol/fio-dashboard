import { useHistory } from 'react-router-dom';

import { ROUTES } from '../../constants/routes';

import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';

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

  return { onSubmit };
};
