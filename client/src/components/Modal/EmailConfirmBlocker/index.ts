import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../../utils';
import { resendConfirmEmail } from '../../../redux/profile/actions';
import {
  loading,
  emailConfirmationToken,
} from '../../../redux/profile/selectors';
import {
  isRefFlow,
  refProfileInfo,
  refProfileQueryParams,
} from '../../../redux/refProfile/selectors';
import { redirectLink } from '../../../redux/navigation/selectors';

import EmailConfirmBlocker from './EmailConfirmBlocker';

const reduxConnect = connect(
  createStructuredSelector({
    emailConfirmationToken,
    redirectLink,
    isRefFlow,
    refProfileInfo,
    refProfileQueryParams,
    loading,
  }),
  {
    resendConfirmEmail,
  },
);

export default compose(reduxConnect)(EmailConfirmBlocker);
