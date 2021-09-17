import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router';

import { compose } from '../../utils';

import { getUsersRecoveryQuestions } from '../../redux/edge/actions';

import { edgeContextSet } from '../../redux/edge/selectors';

import AccountRecoveryPage from './AccountRecoveryPage';

const reduxConnect = connect(
  createStructuredSelector({
    edgeContextSet,
  }),
  {
    getUsersRecoveryQuestions,
  },
);

export default withRouter(compose(reduxConnect)(AccountRecoveryPage));
