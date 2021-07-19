import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { getFioAddresses } from '../../redux/fio/actions';
import {
  fioAddresses,
  fioWallets,
  hasMoreAddresses,
  loading,
} from '../../redux/fio/selectors';

import FioAddressManagePage from './FioAddressManagePage';

const reduxConnect = connect(
  createStructuredSelector({
    data: fioAddresses,
    fioWallets,
    hasMore: hasMoreAddresses,
    loading,
  }),
  { fetchDataFn: getFioAddresses },
);

export default compose(reduxConnect)(FioAddressManagePage);
