import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { user } from '../../redux/profile/selectors';

import ProfilePage from './ProfilePage';

const selector = createStructuredSelector({
  user,
});

const actions = {};

export { ProfilePage };

export default connect(
  selector,
  actions,
)(ProfilePage);
