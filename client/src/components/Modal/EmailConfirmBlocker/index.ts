import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../../utils';
import { resendConfirmEmail } from '../../../redux/profile/actions';
import { setRedirectPath } from '../../../redux/navigation/actions';

import {
  loading,
  emailConfirmationToken,
  emailConfirmationSent,
  isAuthenticated,
  isActiveUser,
} from '../../../redux/profile/selectors';
import { refProfileInfo } from '../../../redux/refProfile/selectors';
import { redirectLink } from '../../../redux/navigation/selectors';

import {
  isContainedFlow,
  containedFlowQueryParams,
} from '../../../redux/containedFlow/selectors';

import EmailConfirmBlocker from './EmailConfirmBlocker';

const reduxConnect = connect(
  createStructuredSelector({
    isAuthenticated,
    isActiveUser,
    emailConfirmationToken,
    emailConfirmationSent,
    redirectLink,
    isContainedFlow,
    refProfileInfo,
    containedFlowQueryParams,
    loading,
  }),
  {
    resendConfirmEmail,
    setRedirectPath,
  },
);

export default compose(reduxConnect)(EmailConfirmBlocker);
