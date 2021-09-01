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

import ChangePassword from './ChangePassword';
import { ReduxState } from '../../../../types';

const reduxConnect = connect(
  createStructuredSelector({
    results: changePasswordResults,
    loading,
    changePasswordError,
    username: (state: ReduxState) =>
      state.profile && state.profile.user && state.profile.user.username,
  }),
  { changePassword, clearChangePasswordResults, clearChangePasswordError },
);

export default compose(reduxConnect)(ChangePassword);
