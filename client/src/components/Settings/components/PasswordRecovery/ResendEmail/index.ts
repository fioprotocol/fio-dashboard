import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../../../../utils';

import { showPinModal } from '../../../../../redux/modal/actions';
import {
  resetPinConfirm,
  getRecoveryToken,
  clearRecoveryToken,
} from '../../../../../redux/edge/actions';
import {
  resendRecovery,
  clearResendRecoveryResults,
} from '../../../../../redux/profile/actions';

import {
  pinConfirmation,
  recoveryToken,
  loading,
} from '../../../../../redux/edge/selectors';
import {
  resendRecoveryResults,
  resending,
} from '../../../../../redux/profile/selectors';

import ResendEmail from './ResendEmail';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    pinConfirmation,
    resending,
    recoveryToken,
    resendRecoveryResults,
  }),
  {
    clearRecoveryToken,
    clearResendRecoveryResults,
    getRecoveryToken,
    resendRecovery,
    resetPinConfirm,
    showPinModal,
  },
);

export default compose(reduxConnect)(ResendEmail);
