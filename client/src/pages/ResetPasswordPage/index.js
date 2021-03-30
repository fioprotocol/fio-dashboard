import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { resetPassword } from '../../redux/profile/actions';
import { pathname } from '../../redux/router/selectors';

import ResetPasswordPage from './ResetPasswordPage';
import { isChangedPwd } from '../../redux/profile/selectors';

const selector = createStructuredSelector({
  isChangedPwd,
  pathname,
});

const actions = { onSubmit: resetPassword };

export { ResetPasswordPage };

export default connect(selector, actions)(ResetPasswordPage);
