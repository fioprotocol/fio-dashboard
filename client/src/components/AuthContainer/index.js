import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { edgeContext, isAuthenticated, loading } from '../../redux/profile/selectors';
import { setEdgeContext } from '../../redux/profile/actions';
import AuthContainer from './AuthContainer';

const selector = createStructuredSelector({
  edgeContext,
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
