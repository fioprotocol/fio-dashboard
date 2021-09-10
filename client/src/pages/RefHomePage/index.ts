import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { compose } from '../../utils';

import { loading as edgeAuthLoading } from '../../redux/edge/selectors';
import { isAuthenticated } from '../../redux/profile/selectors';
import {
  loading,
  refProfileInfo,
  refProfileQueryParams,
  refLinkError,
} from '../../redux/refProfile/selectors';

import { getInfo, setContainedParams } from '../../redux/refProfile/actions';
import { showLoginModal } from '../../redux/modal/actions';

import { RefHomePage } from './RefHomePage';

const reduxConnect = connect(
  createStructuredSelector({
    isAuthenticated,
    loading,
    edgeAuthLoading,
    refProfileInfo,
    refProfileQueryParams,
    refLinkError,
  }),
  {
    getInfo,
    setContainedParams,
    showLoginModal,
  },
);

export default withRouter(compose(reduxConnect)(RefHomePage));
