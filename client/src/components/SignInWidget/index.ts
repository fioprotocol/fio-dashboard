import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';
import SignInWidget from './SignInWidget';

import { loading as edgeAuthLoading } from '../../redux/edge/selectors';
import { showLoginModal } from '../../redux/modal/actions';

const reduxConnect = connect(
  createStructuredSelector({
    edgeAuthLoading,
  }),
  {
    showLoginModal,
  },
);

export default compose(reduxConnect)(SignInWidget);
