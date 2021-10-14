import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router';

import { compose } from '../../utils';

import { confirmEmail } from '../../redux/profile/actions';
import { getInfo } from '../../redux/refProfile/actions';
import { showLoginModal } from '../../redux/modal/actions';
import { addManual as createNotification } from '../../redux/notifications/actions';

import {
  loading,
  emailConfirmationResult,
  isAuthenticated,
  profileRefreshed,
} from '../../redux/profile/selectors';
import { cartItems } from '../../redux/cart/selectors';

import EmailConfirmationPage from './EmailConfirmationPage';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    emailConfirmationResult,
    isAuthenticated,
    profileRefreshed,
    cartItems,
  }),
  {
    confirmEmail,
    getInfo,
    showLoginModal,
    createNotification,
  },
);

export default withRouter(compose(reduxConnect)(EmailConfirmationPage));
