import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { adminSearch, loading } from '../../redux/admin/selectors';

import AdminSearchResultPage from './AdminSearchResultPage';

const reduxConnect = connect(
  createStructuredSelector({
    adminSearch,
    loading,
  }),
  {},
);

export default compose(reduxConnect)(AdminSearchResultPage);
