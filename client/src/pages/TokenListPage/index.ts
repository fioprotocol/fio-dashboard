import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { toggleTokenListInfoBadge } from '../../redux/fio/actions';
import {
  currentFioAddress,
  loading,
  showTokenListInfoBadge,
} from '../../redux/fio/selectors';

import TokenListPage from './TokenListPage';

const reduxConnect = connect(
  createStructuredSelector({
    currentFioAddress,
    showTokenListInfoBadge,
    loading,
  }),
  {
    toggleTokenListInfoBadge,
  },
);

export default compose(reduxConnect)(TokenListPage);
