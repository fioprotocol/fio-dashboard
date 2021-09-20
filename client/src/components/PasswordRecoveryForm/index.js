import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';
import {
  setRecoveryQuestions,
  resendRecovery,
} from '../../redux/profile/actions';
import {
  getRecoveryQuestions,
  resetPinConfirm,
  changeRecoveryQuestionsClose,
} from '../../redux/edge/actions';
import { createNotification } from '../../redux/notifications/actions';
import { closeRecoveryModal, showPinModal } from '../../redux/modal/actions';
import { checkRecoveryQuestions } from '../../redux/edge/actions';
import {
  loading as edgeAuthLoading,
  recoveryQuestions,
  confirmingPin,
  pinConfirmation,
  changeRecoveryQuestions,
} from '../../redux/edge/selectors';
import {
  showRecovery as show,
  showPinConfirm,
} from '../../redux/modal/selectors';
import {
  changeRecoveryQuestionsResults,
  edgeUsername,
} from '../../redux/profile/selectors';

import PasswordRecoveryForm from './PasswordRecoveryForm';

const reduxConnect = connect(
  createStructuredSelector({
    edgeAuthLoading,
    show,
    questions: recoveryQuestions,
    confirmingPin,
    showPinConfirm,
    pinConfirmation,
    changeRecoveryQuestions,
    changeRecoveryQuestionsResults,
    username: edgeUsername,
  }),
  {
    onSubmit: setRecoveryQuestions,
    closeRecoveryModal,
    getRecoveryQuestions,
    createNotification,
    showPinModal,
    resetPinConfirm,
    changeRecoveryQuestionsClose,
    checkRecoveryQuestions,
    resendRecovery,
  },
);

export { PasswordRecoveryForm };

export default compose(reduxConnect)(PasswordRecoveryForm);
