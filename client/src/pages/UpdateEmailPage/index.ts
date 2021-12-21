import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router';

import { compose } from '../../utils';

import { updateEmail, resetLastAuthData } from '../../redux/profile/actions';
import { showLoginModal } from '../../redux/modal/actions';
import { addManual as createNotification } from '../../redux/notifications/actions';

import {
  loading,
  emailConfirmationResult,
  isAuthenticated,
  profileRefreshed,
  lastAuthData,
  updateEmailLoading,
} from '../../redux/profile/selectors';

import UpdateEmailPage from './UpdateEmailPage';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    emailConfirmationResult,
    isAuthenticated,
    profileRefreshed,
    lastAuthData,
    updateEmailLoading,
  }),
  {
    updateEmail,
    showLoginModal,
    createNotification,
    resetLastAuthData,
  },
);

export default withRouter(compose(reduxConnect)(UpdateEmailPage));
