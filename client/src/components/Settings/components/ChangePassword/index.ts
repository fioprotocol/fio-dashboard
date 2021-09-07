import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../../../utils';

import {
  changePassword,
  clearChangePasswordResults,
  clearChangePasswordError,
} from '../../../../redux/edge/actions';
import {
  changePasswordResults,
  loading,
  changePasswordError,
} from '../../../../redux/edge/selectors';
import { edgeUsername } from '../../../../redux/profile/selectors';

import ChangePassword from './ChangePassword';

const reduxConnect = connect(
  createStructuredSelector({
    results: changePasswordResults,
    loading,
    changePasswordError,
    username: edgeUsername,
  }),
  { changePassword, clearChangePasswordResults, clearChangePasswordError },
);

export default compose(reduxConnect)(ChangePassword);
