import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { showRecoveryModal } from '../../redux/modal/actions';
import { list } from '../../redux/notifications/selectors';
import {
  listNotifications,
  updateNotification,
  removeManual,
} from '../../redux/notifications/actions';
import { user } from '../../redux/profile/selectors';
import { account } from '../../redux/edge/selectors';

import Notifications from './Notifications';

const selector = createStructuredSelector({
  list,
  user,
  account,
});

const actions = dispatch => ({
  update: data => dispatch(updateNotification(data)),
  listNotifications: () => dispatch(listNotifications()),
  removeManual: data => dispatch(removeManual(data)),
  showRecoveryModal: () => dispatch(showRecoveryModal()),
});

export default connect(selector, actions)(Notifications);
