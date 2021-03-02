import { connect } from 'react-redux';

import { setAccount } from '../../redux/profile/actions';

import LoginPage from './LoginPage';

export default connect(
  null,
  { setAccount },
)(LoginPage);
