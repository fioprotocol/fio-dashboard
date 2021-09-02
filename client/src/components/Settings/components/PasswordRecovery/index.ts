import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../../../utils';

import { showRecoveryModal } from '../../../../redux/modal/actions';
import { changeRecoveryQuestionsOpen } from '../../../../redux/edge/actions';

import PasswordRecovery from './PasswordRecovery';

const reduxConnect = connect(createStructuredSelector({}), {
  showRecoveryModal,
  changeRecoveryQuestionsOpen,
});

export default compose(reduxConnect)(PasswordRecovery);
