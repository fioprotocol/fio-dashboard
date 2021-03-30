import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { edgeContextSet } from '../../redux/edge/selectors';
import { login } from '../../redux/edge/actions';

import LoginPage from './LoginPage';
const selector = createStructuredSelector({
  edgeContextSet,
});
export default connect(selector, { login })(LoginPage);
