import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import PasswordForm from './PasswordForm';

import { edgeUsername } from '../../../../redux/profile/selectors';

import { compose } from '../../../../utils';

const reduxConnect = connect(
  createStructuredSelector({
    username: edgeUsername,
  }),
);
export default compose(reduxConnect)(PasswordForm);
