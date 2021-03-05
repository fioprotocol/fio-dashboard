import { connect } from 'react-redux';
import { createStructuredSelector } from "reselect";

import { edgeContext } from '../../redux/profile/selectors';
import { setAccount } from '../../redux/profile/actions';

import LoginPage from './LoginPage';
const selector = createStructuredSelector({
  edgeContext,
});
export default connect(
  selector,
  { setAccount },
)(LoginPage);
