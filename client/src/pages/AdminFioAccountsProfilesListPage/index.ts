import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { getFioAccountsProfilesList } from '../../redux/admin/actions';

import {
  fioAccountsProfilesCount,
  fioAccountsProfilesList,
  loading,
} from '../../redux/admin/selectors';

import AdminFioAccountsProfilesListPage from './AdminFioAccountsProfilesListPage';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    fioAccountsProfilesList,
    fioAccountsProfilesCount,
  }),
  {
    getFioAccountsProfilesList,
  },
);

export default compose(reduxConnect)(AdminFioAccountsProfilesListPage);
