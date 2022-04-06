import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { refreshFioNames } from '../../redux/fio/actions';

import { profileRefreshed } from '../../redux/profile/selectors';
import {
  loading,
  fioWallets,
  fioAddresses,
  fioDomains,
} from '../../redux/fio/selectors';

import FioNamesInitWrapper from './FioNamesInitWrapper';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    profileRefreshed,
    fioWallets,
    fioAddresses,
    fioDomains,
  }),
  {
    refreshFioNames,
  },
);

export default compose(reduxConnect)(FioNamesInitWrapper);
