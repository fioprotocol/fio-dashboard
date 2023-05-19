import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getDomains } from '../../redux/registrations/actions';
import { refreshFioNames } from '../../redux/fio/actions';

import { fioWallets } from '../../redux/fio/selectors';
import {
  loading as pricesLoading,
  prices,
  allDomains,
  roe,
} from '../../redux/registrations/selectors';

import { compose } from '../../utils';

import AddressDomainForm from './AddressDomainForm';

const reduxConnect = connect(
  createStructuredSelector({
    pricesLoading,
    prices,
    domains: allDomains,
    fioWallets,
    roe,
  }),
  {
    getDomains,
    refreshFioNames,
  },
);

export default compose(reduxConnect)(AddressDomainForm);
