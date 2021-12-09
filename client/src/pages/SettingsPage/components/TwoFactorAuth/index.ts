import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../../../utils';

import { toggleTwoFactorAuth } from '../../../../redux/edge/actions';
import { showGenericErrorModal } from '../../../../redux/modal/actions';

import { hasTwoFactorAuth } from '../../../../redux/edge/selectors';
import { showGenericError } from '../../../../redux/modal/selectors';

import TwoFactorAuth from './TwoFactorAuth';

const reduxConnect = connect(
  createStructuredSelector({
    hasTwoFactorAuth,
    genericErrorIsShowing: showGenericError,
  }),
  { toggleTwoFactorAuth, showGenericErrorModal },
);

export default compose(reduxConnect)(TwoFactorAuth);
