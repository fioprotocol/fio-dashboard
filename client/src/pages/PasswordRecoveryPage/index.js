import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import PasswordRecoveryPage from './PasswordRecoveryPage';
import { isRecoveryRequested } from '../../redux/profile/selectors';

const selector = createStructuredSelector({
  isRecoveryRequested,
});

const actions = {};

export { PasswordRecoveryPage };

export default connect(
  selector,
  actions,
)(PasswordRecoveryPage);
