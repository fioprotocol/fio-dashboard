import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { pathname } from '../../redux/navigation/selectors';
import { confirm } from '../../redux/profile/actions';
import { isConfirmed } from '../../redux/profile/selectors';

import ConfirmEmail from './ConfirmEmail';

const selector = createStructuredSelector({
  pathname,
  isConfirmed,
});

const actions = {
  confirm,
};

export { ConfirmEmail };

export default connect(selector, actions)(ConfirmEmail);
