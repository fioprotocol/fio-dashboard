import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import {
  containedFlowLinkError,
  isContainedFlow,
} from '../../redux/containedFlow/selectors';
import { isAuthenticated } from '../../redux/profile/selectors';

import ContainedFlowWrapper from './ContainedFlowWrapper';

const reduxConnect = connect(
  createStructuredSelector({
    containedFlowLinkError,
    isContainedFlow,
    isAuthenticated,
  }),
  {},
);

export default compose(reduxConnect)(ContainedFlowWrapper);
