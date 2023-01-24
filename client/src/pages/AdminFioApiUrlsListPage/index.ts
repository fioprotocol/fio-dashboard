import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { getFioApiUrlsList } from '../../redux/admin/actions';

import {
  fioApiUrlsList,
  fioApiUrlsCount,
  loading,
} from '../../redux/admin/selectors';

import AdminFioApiUrlsListPage from './AdminFioApiUrlsListPage';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    fioApiUrlsList,
    fioApiUrlsCount,
  }),
  {
    getFioApiUrlsList,
  },
);

export default compose(reduxConnect)(AdminFioApiUrlsListPage);
