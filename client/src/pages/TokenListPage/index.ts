import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { toggleTokenListInfoBadge } from '../../redux/fio/actions';
import {
  currentFioCryptoHandle,
  loading,
  showTokenListInfoBadge,
} from '../../redux/fio/selectors';

import TokenListPage from './TokenListPage';

const reduxConnect = connect(
  createStructuredSelector({
    currentFioCryptoHandle,
    showTokenListInfoBadge,
    loading,
  }),
  {
    toggleTokenListInfoBadge,
  },
);

export default compose(reduxConnect)(TokenListPage);
