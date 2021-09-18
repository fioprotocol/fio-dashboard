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
} from '../../../../redux/edge/actions';
import { resendRecovery } from '../../../../redux/profile/actions';

import {
  hasRecoveryQuestions,
  pinConfirmation,
  disableRecoveryResults,
  loading,
} from '../../../../redux/edge/selectors';
import { edgeUsername } from '../../../../redux/profile/selectors';

import PasswordRecovery from './PasswordRecovery';

const reduxConnect = connect(
  createStructuredSelector({
    hasRecoveryQuestions,
    username: edgeUsername,
    pinConfirmation,
    disableRecoveryResults,
    loading,
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
  },
);

export default compose(reduxConnect)(PasswordRecovery);
