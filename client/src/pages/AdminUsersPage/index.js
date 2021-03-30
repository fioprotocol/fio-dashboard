import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { listUsers, showUser } from '../../redux/users/actions';
import { loading, list } from '../../redux/users/selectors';
import AdminUsersPage from './AdminUsersPage';

const selector = createStructuredSelector({
  loading,
  list,
});

const actions = {
  listUsers,
  showUser,
};

export { AdminUsersPage };

export default connect(selector, actions)(AdminUsersPage);
