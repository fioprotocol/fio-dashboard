import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../../../utils';

import { changePassword } from '../../../../redux/edge/actions';
import {
  changePasswordResults,
  loading,
} from '../../../../redux/edge/selectors';

import ChangePassword from './ChangePassword';

const reduxConnect = connect(
  createStructuredSelector({
    results: changePasswordResults,
    loading,
  }),
  { changePassword },
);

export default compose(reduxConnect)(ChangePassword);
