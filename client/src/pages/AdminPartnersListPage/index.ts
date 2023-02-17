import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { getFioAccountsProfilesList } from '../../redux/admin/actions';
import { getPartnersList } from '../../redux/admin/actions';

import {
  fioAccountsProfilesList,
  loading as fioAccountLoading,
} from '../../redux/admin/selectors';

import { partnersList, loading } from '../../redux/admin/selectors';

import AdminPartnersListPage from './AdminPartnersListPage';

const reduxConnect = connect(
  createStructuredSelector({
    fioAccountLoading,
    loading,
    fioAccountsProfilesList,
    partnersList,
  }),
  {
    getFioAccountsProfilesList,
    getPartnersList,
  },
);

export default compose(reduxConnect)(AdminPartnersListPage);
