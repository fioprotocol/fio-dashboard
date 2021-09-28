import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router';

import { compose } from '../../utils';

import { confirmEmail } from '../../redux/profile/actions';

import {
  loading,
  emailConfirmationResult,
} from '../../redux/profile/selectors';

import EmailConfirmationPage from './EmailConfirmationPage';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    emailConfirmationResult,
  }),
  {
    confirmEmail,
  },
);

export default withRouter(compose(reduxConnect)(EmailConfirmationPage));
