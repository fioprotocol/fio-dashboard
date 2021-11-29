import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../../../utils';

import { loading } from '../../../../redux/edge/selectors';
import { showGenericError } from '../../../../redux/modal/selectors';

import TwoFactorAuth from './TwoFactorAuth';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    genericErrorIsShowing: showGenericError,
  }),
  {},
);

export default compose(reduxConnect)(TwoFactorAuth);
