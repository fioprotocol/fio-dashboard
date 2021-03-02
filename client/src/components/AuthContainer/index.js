import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { isAuthenticated, loading } from '../../redux/profile/selectors';
import AuthContainer from './AuthContainer';

const selector = createStructuredSelector({
  isAuthenticated,
  loading,
});

const actions = {};

export default connect(
  selector,
  actions,
)(AuthContainer);
