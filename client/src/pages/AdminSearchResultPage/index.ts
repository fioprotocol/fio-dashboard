import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { adminSearch, loading, orderItem } from '../../redux/admin/selectors';

import AdminSearchResultPage from './AdminSearchResultPage';
import { getOrder } from '../../redux/admin/actions';

const reduxConnect = connect(
  createStructuredSelector({
    adminSearch,
    loading,
    orderItem,
  }),
  { getOrder },
);

export default compose(reduxConnect)(AdminSearchResultPage);
