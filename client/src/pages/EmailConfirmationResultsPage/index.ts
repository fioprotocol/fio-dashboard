import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router';

import { compose } from '../../utils';

import {
  logout,
  resetLastAuthData,
  resetEmailConfirmationResult,
} from '../../redux/profile/actions';
import { showLoginModal } from '../../redux/modal/actions';
import { addManual as createNotification } from '../../redux/notifications/actions';

import {
  emailConfirmationResult,
  isAuthenticated,
  user,
  lastAuthData,
} from '../../redux/profile/selectors';
import { cartItems } from '../../redux/cart/selectors';

import EmailConfirmationResultsPage from './EmailConfirmationResultsPage';

const reduxConnect = connect(
  createStructuredSelector({
    isAuthenticated,
    user,
    lastAuthData,
    emailConfirmationResult,
    cartItems,
  }),
  {
    showLoginModal,
    logout,
    resetLastAuthData,
    createNotification,
    resetEmailConfirmationResult,
  },
);

export default withRouter(compose(reduxConnect)(EmailConfirmationResultsPage));
