import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { account } from '../../redux/edge/selectors';
import { user } from '../../redux/profile/selectors';
import DashboardPage from './DashboardPage';

const selector = createStructuredSelector({
  account,
  user,
});

const actions = {};

export { DashboardPage };

export default connect(selector, actions)(DashboardPage);
