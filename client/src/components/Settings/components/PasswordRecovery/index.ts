import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../../../utils';

import {
  showRecoveryModal,
  showPinModal,
} from '../../../../redux/modal/actions';
import {
  changeRecoveryQuestionsOpen,
  checkRecoveryQuestions,
  resetPinConfirm,
  disableRecoveryPassword,
  clearDisableRecoveryResults,
  getRecoveryToken,
  clearRecoveryToken,
} from '../../../../redux/edge/actions';
import {
  resendRecovery,
  clearResendRecoveryResults,
} from '../../../../redux/profile/actions';

import {
  hasRecoveryQuestions,
  pinConfirmation,
  disableRecoveryResults,
  loading,
  recoveryToken,
} from '../../../../redux/edge/selectors';
import {
  edgeUsername,
  resendRecoveryResults,
  resending,
} from '../../../../redux/profile/selectors';

import PasswordRecovery from './PasswordRecovery';

const reduxConnect = connect(
  createStructuredSelector({
    hasRecoveryQuestions,
    username: edgeUsername,
    pinConfirmation,
    disableRecoveryResults,
    loading,
    recoveryToken,
    resendRecoveryResults,
    resending,
  }),
  {
    showRecoveryModal,
    changeRecoveryQuestionsOpen,
    resendRecovery,
    checkRecoveryQuestions,
    resetPinConfirm,
    showPinModal,
    disableRecoveryPassword,
    clearDisableRecoveryResults,
    getRecoveryToken,
    clearRecoveryToken,
    clearResendRecoveryResults,
  },
);

export default compose(reduxConnect)(PasswordRecovery);
