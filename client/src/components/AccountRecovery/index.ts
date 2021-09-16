import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { showLoginModal } from '../../redux/modal/actions';
import {
  getUsersRecoveryQuestions,
  recoveryAccount,
  clearRecoveryResults,
} from '../../redux/edge/actions';

import {
  edgeContextSet,
  loading,
  usersRecoveryQuestions,
  questionsLoading,
  recoveryAccountResults,
} from '../../redux/edge/selectors';

import AccountRecovery from './AccountRecovery';

const reduxConnect = connect(
  createStructuredSelector({
    questions: usersRecoveryQuestions,
    edgeContextSet,
    loading,
    questionsLoading,
    recoveryAccountResults,
  }),
  {
    getUsersRecoveryQuestions,
    recoveryAccount,
    showLoginModal,
    clearRecoveryResults,
  },
);

export default compose(reduxConnect)(AccountRecovery);
