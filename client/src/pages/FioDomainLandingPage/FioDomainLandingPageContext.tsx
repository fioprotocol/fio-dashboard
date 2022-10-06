import { useHistory } from 'react-router-dom';

import { ROUTES } from '../../constants/routes';

import { FormValues } from '../../components/FioDomainWidget/types';

export const useContext = () => {
  const history = useHistory();
  const onSubmit = (values: FormValues) => {
    let domainSelectionRoute = ROUTES.FIO_DOMAINS_SELECTION;

    if (values.domain) {
      domainSelectionRoute += `?domain=${values.domain}`;
    }

    history.push(domainSelectionRoute);
  };

  return { onSubmit };
};
