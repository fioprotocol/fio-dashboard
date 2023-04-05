import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { compose } from '../../utils';

import { isAuthenticated } from '../../redux/profile/selectors';
import {
  isContainedFlow,
  containedFlowQueryParams,
} from '../../redux/containedFlow/selectors';
import { refProfileInfo } from '../../redux/refProfile/selectors';

import TwitterPage from './TwitterPage';

const reduxConnect = connect(
  createStructuredSelector({
    isAuthenticated,
    isContainedFlow,
    refProfileInfo,
    containedFlowQueryParams,
  }),
  {},
);

export { TwitterPage };

export default withRouter(compose(reduxConnect)(TwitterPage));
