import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../../../utils';

import {
  enableTwoFactorAuth,
  disableTwoFactor,
} from '../../../../redux/edge/actions';

import {
  twoFactorAuthLoading,
  hasTwoFactorAuth,
} from '../../../../redux/edge/selectors';
import { showGenericError } from '../../../../redux/modal/selectors';

import TwoFactorAuth from './TwoFactorAuth';

const reduxConnect = connect(
  createStructuredSelector({
    loading: twoFactorAuthLoading,
    hasTwoFactorAuth,
    genericErrorIsShowing: showGenericError,
  }),
  {
    enableTwoFactorAuth,
    disableTwoFactor,
  },
);

export default compose(reduxConnect)(TwoFactorAuth);
