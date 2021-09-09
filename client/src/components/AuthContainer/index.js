import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { edgeContextInit } from '../../redux/edge/actions';
import { isAuthenticated, loading } from '../../redux/profile/selectors';
import { edgeContextSet } from '../../redux/edge/selectors';
import { isRefFlow } from '../../redux/refProfile/selectors';
import AuthContainer from './AuthContainer';

const selector = createStructuredSelector({
  edgeContextSet,
  isAuthenticated,
  isRefFlow,
  loading,
});

const actions = {
  edgeContextInit,
};

export default connect(selector, actions)(AuthContainer);
