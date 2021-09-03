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

import { ReduxState } from '../../../../types';
import PasswordRecovery from './PasswordRecovery';

const reduxConnect = connect(
  createStructuredSelector({
    hasRecoveryQuestions,
    username: (state: ReduxState) =>
      state.profile && state.profile.user && state.profile.user.username,
  }),
  {
    showRecoveryModal,
    changeRecoveryQuestionsOpen,
    resendRecovery,
    checkRecoveryQuestions,
  },
);

export default compose(reduxConnect)(PasswordRecovery);
