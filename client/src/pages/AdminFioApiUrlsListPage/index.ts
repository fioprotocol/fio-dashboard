import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { getFioApiUrlsList } from '../../redux/admin/actions';

import { fioApiUrlsList, loading } from '../../redux/admin/selectors';

import AdminFioApiUrlsListPage from './AdminFioApiUrlsListPage';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    fioApiUrlsList,
  }),
  {
    getFioApiUrlsList,
  },
);

export default compose(reduxConnect)(AdminFioApiUrlsListPage);
