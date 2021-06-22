import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';
import { setRecoveryQuestions } from '../../redux/profile/actions';
import { getRecoveryQuestions } from '../../redux/edge/actions';
import { createNotification } from '../../redux/notifications/actions';
import { closeRecoveryModal as onClose } from '../../redux/modal/actions';
import {
  loading as edgeAuthLoading,
  recoveryQuestions,
} from '../../redux/edge/selectors';
import { showRecovery as show } from '../../redux/modal/selectors';
import { edgeUsername } from '../../redux/profile/selectors';

import PasswordRecoveryForm from './PasswordRecoveryForm';

const reduxConcect = connect(
  createStructuredSelector({
    edgeAuthLoading,
    show,
    edgeUsername,
    questions: recoveryQuestions,
  }),
  {
    onSubmit: setRecoveryQuestions,
    onClose,
    getRecoveryQuestions,
    createNotification,
  },
);

export { PasswordRecoveryForm };

export default compose(reduxConcect)(PasswordRecoveryForm);
