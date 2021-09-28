import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';
import { resendConfirmEmail } from '../../redux/profile/actions';
import { closeEmailConfirmBlocker } from '../../redux/modal/actions';
import { showEmailConfirmBlocker } from '../../redux/modal/selectors';
import { edgeUsername } from '../../redux/profile/selectors';

import EmailConfirmBlocker from './EmailConfirmBlocker';

const reduxConnect = connect(
  createStructuredSelector({
    showEmailConfirmBlocker,
    edgeUsername,
  }),
  {
    closeEmailConfirmBlocker,
    resendConfirmEmail,
  },
);

export default compose(reduxConnect)(EmailConfirmBlocker);
