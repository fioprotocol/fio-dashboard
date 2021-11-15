import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../../../utils';

import { showRecoveryModal } from '../../../../redux/modal/actions';
import {
  changeRecoveryQuestionsOpen,
  checkRecoveryQuestions,
} from '../../../../redux/edge/actions';

import {
  hasRecoveryQuestions,
  loading,
} from '../../../../redux/edge/selectors';
import { edgeUsername } from '../../../../redux/profile/selectors';
import { showGenericError } from '../../../../redux/modal/selectors';

import PasswordRecovery from './PasswordRecovery';

const reduxConnect = connect(
  createStructuredSelector({
    hasRecoveryQuestions,
    username: edgeUsername,
    loading,
    genericErrorIsShowing: showGenericError,
  }),
  {
    showRecoveryModal,
    changeRecoveryQuestionsOpen,
    checkRecoveryQuestions,
  },
);

export default compose(reduxConnect)(PasswordRecovery);
