import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { isAuthenticated, loading } from '../../redux/profile/selectors';
import { edgeContextSet } from '../../redux/edge/selectors';
import { setEdgeContext } from '../../redux/edge/actions';
import AuthContainer from './AuthContainer';

const selector = createStructuredSelector({
  edgeContextSet,
  isAuthenticated,
  loading,
});

const actions = {
  setEdgeContext
};

export default connect(
  selector,
  actions,
)(AuthContainer);
