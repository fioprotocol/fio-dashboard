import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { getPartnersList } from '../../redux/admin/actions';

import { partnersList, loading } from '../../redux/admin/selectors';

import AdminPartnersListPage from './AdminPartnersListPage';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    partnersList,
  }),
  {
    getPartnersList,
  },
);

export default compose(reduxConnect)(AdminPartnersListPage);
