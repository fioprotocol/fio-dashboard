import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';
import { setRecoveryQuestions } from '../../redux/profile/actions';
import { getRecoveryQuestions } from '../../redux/edge/actions';
import { createNotification } from '../../redux/notifications/actions';
import {
  closeRecoveryModal as onClose,
  showPinModal,
} from '../../redux/modal/actions';
import {
  loading as edgeAuthLoading,
  recoveryQuestions,
  confirmingPin,
  pinConfirmation,
} from '../../redux/edge/selectors';
import {
  showRecovery as show,
  showPinConfirm,
} from '../../redux/modal/selectors';

import PasswordRecoveryForm from './PasswordRecoveryForm';

const reduxConnect = connect(
  createStructuredSelector({
    edgeAuthLoading,
    show,
    questions: recoveryQuestions,
    confirmingPin,
    showPinConfirm,
    pinConfirmation,
  }),
  {
    onSubmit: setRecoveryQuestions,
    onClose,
    getRecoveryQuestions,
    createNotification,
    showPinModal,
  },
);

export { PasswordRecoveryForm };

export default compose(reduxConnect)(PasswordRecoveryForm);
