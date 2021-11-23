import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';
import { setRecoveryQuestions } from '../../redux/profile/actions';
import {
  getRecoveryQuestions,
  changeRecoveryQuestionsClose,
} from '../../redux/edge/actions';
import { createNotification } from '../../redux/notifications/actions';
import { closeRecoveryModal } from '../../redux/modal/actions';
import { checkRecoveryQuestions } from '../../redux/edge/actions';
import {
  loading as edgeAuthLoading,
  recoveryQuestions,
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
    showPinConfirm,
    questions: recoveryQuestions,
    changeRecoveryQuestions,
    changeRecoveryQuestionsResults,
    username: edgeUsername,
  }),
  {
    onSubmit: setRecoveryQuestions,
    closeRecoveryModal,
    getRecoveryQuestions,
    createNotification,
    changeRecoveryQuestionsClose,
    checkRecoveryQuestions,
  },
);

export { PasswordRecoveryForm };

export default compose(reduxConnect)(PasswordRecoveryForm);
