import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { edgeContextInit } from '../../redux/edge/actions';

import { isAuthenticated, loading } from '../../redux/profile/selectors';
import { edgeContextSet } from '../../redux/edge/selectors';

import AuthContainer from './AuthContainer';

const selector = createStructuredSelector({
  edgeContextSet,
  isAuthenticated,
  loading,
});

const actions = {
  edgeContextInit,
};

export default withRouter(connect(selector, actions)(AuthContainer));
