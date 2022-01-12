import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { getFioCryptoHandles } from '../../redux/fio/actions';
import {
  fioCryptoHandles,
  hasMoreCryptoHandles,
} from '../../redux/fio/selectors';
import { fioWallets, loading } from '../../redux/fio/selectors';
import { noProfileLoaded } from '../../redux/profile/selectors';

import FioAddressManagePage from './FioAddressManagePage';

const reduxConnect = connect(
  createStructuredSelector({
    fioNameList: fioCryptoHandles,
    fioWallets,
    hasMore: hasMoreCryptoHandles,
    loading,
    noProfileLoaded,
  }),
  { fetchDataFn: getFioCryptoHandles },
);

export default compose(reduxConnect)(FioAddressManagePage);
