import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../../../utils';

import { showRecoveryModal } from '../../../../redux/modal/actions';
import {
  changeRecoveryQuestionsOpen,
  checkRecoveryQuestions,
} from '../../../../redux/edge/actions';
import { resendRecovery } from '../../../../redux/profile/actions';

import { hasRecoveryQuestions } from '../../../../redux/edge/selectors';
import { edgeUsername } from '../../../../redux/profile/selectors';

import PasswordRecovery from './PasswordRecovery';

const reduxConnect = connect(
  createStructuredSelector({
    hasRecoveryQuestions,
    username: edgeUsername,
  }),
  {
    showRecoveryModal,
    changeRecoveryQuestionsOpen,
    resendRecovery,
    checkRecoveryQuestions,
  },
);

export default compose(reduxConnect)(PasswordRecovery);
