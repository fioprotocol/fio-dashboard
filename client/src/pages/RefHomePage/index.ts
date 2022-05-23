import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { compose } from '../../utils';

import { loading as edgeAuthLoading } from '../../redux/edge/selectors';
import { isAuthenticated } from '../../redux/profile/selectors';
import {
  loading,
  refProfileInfo,
  refLinkError,
} from '../../redux/refProfile/selectors';
import { containedFlowQueryParams } from '../../redux/containedFlow/selectors';

import { showLoginModal } from '../../redux/modal/actions';

import { RefHomePage } from './RefHomePage';

const reduxConnect = connect(
  createStructuredSelector({
    isAuthenticated,
    loading,
    edgeAuthLoading,
    refProfileInfo,
    containedFlowQueryParams,
    refLinkError,
  }),
  {
    showLoginModal,
  },
);

export default withRouter(compose(reduxConnect)(RefHomePage));
