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

import { getInfo, setContainedParams } from '../../redux/refProfile/actions';
import { showLoginModal } from '../../redux/modal/actions';

import { RefHomePage } from './RefHomePage';

const reduxConnect = connect(
  createStructuredSelector({
    isAuthenticated,
    loading,
    refProfileInfo,
    refLinkError,
  }),
  {
    getInfo,
    setContainedParams,
    showLoginModal,
  },
);

export default withRouter(compose(reduxConnect)(RefHomePage));
