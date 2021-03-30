import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { pathname } from '../../redux/router/selectors';
import { user } from '../../redux/profile/selectors';
import { account, loginSuccess } from '../../redux/edge/selectors';
import { logout } from '../../redux/profile/actions';
import { showLoginModal } from '../../redux/modal/actions';

import MainHeader from './MainHeader';

const selector = createStructuredSelector({
  pathname,
  user,
  account,
  loginSuccess,
});

const actions = {
  showLoginModal,
  logout,
};


export { MainHeader };

export default connect(selector,actions)(MainHeader);
