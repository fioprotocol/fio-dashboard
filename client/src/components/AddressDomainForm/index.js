import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getDomains } from '../../redux/registrations/actions';
import { fioDomains, fioWallets } from '../../redux/fio/selectors';
import {
  loading as pricesLoading,
  prices,
  domains,
  allowCustomDomains,
  roe,
} from '../../redux/registrations/selectors';

import { compose } from '../../utils';

import AddressDomainForm from './AddressDomainForm';

const reduxConnect = connect(
  createStructuredSelector({
    pricesLoading,
    prices,
    domains: state => {
      const publicDomains = domains(state);
      const userDomains = fioDomains(state);
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
  },
);

export default compose(reduxConnect)(AddressDomainForm);
