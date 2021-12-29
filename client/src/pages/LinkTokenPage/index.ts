import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import {
  getAllFioPubAddresses,
  toggleTokenListInfoBadge,
} from '../../redux/fio/actions';
import {
  currentFioAddress,
  loading,
  showTokenListInfoBadge,
  fioWallets,
} from '../../redux/fio/selectors';

import TokenListPage from './TokenListPage';

const reduxConnect = connect(
  createStructuredSelector({
    currentFioAddress,
    showTokenListInfoBadge,
    loading,
    fioWallets,
  }),
  {
    getAllFioPubAddresses,
    toggleTokenListInfoBadge,
  },
);

export default compose(reduxConnect)(TokenListPage);
