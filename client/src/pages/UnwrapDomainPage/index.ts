import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { loading } from '../../redux/fio/selectors';
import { roe } from '../../redux/registrations/selectors';
import UnwrapDomainPage from './UnwrapDomainPage';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    roe,
  }),
  {},
);

export default compose(reduxConnect)(UnwrapDomainPage);
