import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { account } from '../../redux/profile/selectors';
import DashboardPage from './DashboardPage';

const selector = createStructuredSelector({
  account,
});

const actions = {};

export { DashboardPage };

export default connect(
  selector,
  actions,
)(DashboardPage);
