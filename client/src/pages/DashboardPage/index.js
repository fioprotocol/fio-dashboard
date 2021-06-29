import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { user } from '../../redux/profile/selectors';
import { fioWallets } from '../../redux/fio/selectors';
import DashboardPage from './DashboardPage';

const selector = createStructuredSelector({
  fioWallets,
  user,
});

const actions = {};

export { DashboardPage };

export default connect(selector, actions)(DashboardPage);
