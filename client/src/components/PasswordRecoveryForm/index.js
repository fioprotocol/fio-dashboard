import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';
import { setRecoveryQuestions } from '../../redux/profile/actions';
import { getRecoveryQuestions } from '../../redux/edge/actions';
import {
  loading,
  recoveryQuestions,
  account,
} from '../../redux/edge/selectors';
import { showRecovery as show } from '../../redux/modal/selectors';
import { closeRecoveryModal as onClose } from '../../redux/modal/actions';

import PasswordRecoveryForm from './PasswordRecoveryForm';

const reduxConcect = connect(
  createStructuredSelector({
    account,
    loading,
    show,
    questions: recoveryQuestions,
  }),
  { onSubmit: setRecoveryQuestions, onClose, getRecoveryQuestions },
);

export { PasswordRecoveryForm };

export default compose(reduxConcect)(PasswordRecoveryForm);
