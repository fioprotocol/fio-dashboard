import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router';

import { compose } from '../../utils';

import { confirmEmail } from '../../redux/profile/actions';
import { getInfo } from '../../redux/refProfile/actions';

import {
  emailConfirmationResult,
  profileRefreshed,
} from '../../redux/profile/selectors';

import EmailConfirmationPage from './EmailConfirmationPage';

const reduxConnect = connect(
  createStructuredSelector({
    profileRefreshed,
    emailConfirmationResult,
  }),
  {
    confirmEmail,
    getInfo,
  },
);

export default withRouter(compose(reduxConnect)(EmailConfirmationPage));
