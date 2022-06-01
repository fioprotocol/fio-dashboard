import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { compose } from '../../utils';

import { isAuthenticated } from '../../redux/profile/selectors';
import {
  loading,
  refProfileInfo,
  refLinkError,
} from '../../redux/refProfile/selectors';
import {
  containedFlowQueryParams,
  isContainedFlow,
} from '../../redux/containedFlow/selectors';

import { RefHomePage } from './RefHomePage';

const reduxConnect = connect(
  createStructuredSelector({
    isAuthenticated,
    loading,
    refProfileInfo,
    containedFlowQueryParams,
    refLinkError,
    isContainedFlow,
  }),
  {},
);

export default withRouter(compose(reduxConnect)(RefHomePage));
