import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { getFioDomains } from '../../redux/fio/actions';
import {
  fioDomains,
  fioWallets,
  hasMoreDomains,
  loading,
} from '../../redux/fio/selectors';

import FioDomainManagePage from './FioDomainManagePage';

const reduxConnect = connect(
  createStructuredSelector({
    data: fioDomains,
    fioWallets,
    hasMore: hasMoreDomains,
    loading,
  }),
  { fetchDataFn: getFioDomains },
);

export default compose(reduxConnect)(FioDomainManagePage);
