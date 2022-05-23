import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { isAuthenticated } from '../../redux/profile/selectors';

import { containedFlowQueryParams } from '../../redux/containedFlow/selectors';

import { RefSignNftPage } from './RefSignNftPage';

const reduxConnect = connect(
  createStructuredSelector({
    isAuthenticated,
    containedFlowQueryParams,
  }),
);

export default compose(reduxConnect)(RefSignNftPage);
