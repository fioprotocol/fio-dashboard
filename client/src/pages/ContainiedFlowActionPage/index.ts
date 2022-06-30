import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { isAuthenticated } from '../../redux/profile/selectors';

import { containedFlowQueryParams } from '../../redux/containedFlow/selectors';

import { ContainiedFlowActionPage } from './ContainiedFlowActionPage';

const reduxConnect = connect(
  createStructuredSelector({
    isAuthenticated,
    containedFlowQueryParams,
  }),
);

export default compose(reduxConnect)(ContainiedFlowActionPage);
