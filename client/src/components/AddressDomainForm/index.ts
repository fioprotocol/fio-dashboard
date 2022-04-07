import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getDomains } from '../../redux/registrations/actions';
import { refreshFioNames } from '../../redux/fio/actions';

import { fioDomains, fioWallets } from '../../redux/fio/selectors';
import {
  loading as pricesLoading,
  prices,
  domains,
  allowCustomDomains,
  roe,
} from '../../redux/registrations/selectors';

import { compose } from '../../utils';

import { ReduxState } from '../../redux/init';

import { FioDomainDoublet } from '../../types';

import AddressDomainForm from './AddressDomainForm';

const reduxConnect = connect(
  createStructuredSelector({
    pricesLoading,
    prices,
    domains: (state: ReduxState) => {
      const publicDomains = domains(state);
      const userDomains: FioDomainDoublet[] = fioDomains(state);
      return [
        ...publicDomains,
        ...userDomains.map(({ name }) => ({ domain: name })),
      ];
    },
    fioWallets,
    allowCustomDomains,
    roe,
  }),
  {
    getDomains,
    refreshFioNames,
  },
);

export default compose(reduxConnect)(AddressDomainForm);
