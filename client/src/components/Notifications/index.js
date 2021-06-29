import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';

import { showRecoveryModal } from '../../redux/modal/actions';
import { list } from '../../redux/notifications/selectors';
import {
  listNotifications,
  updateNotification,
  removeManual,
} from '../../redux/notifications/actions';
import { user } from '../../redux/profile/selectors';

import Notifications from './Notifications';

const selector = createStructuredSelector({
  list,
  user,
});

const actions = dispatch => ({
  update: data => dispatch(updateNotification(data)),
  listNotifications: () => dispatch(listNotifications()),
  removeManual: data => dispatch(removeManual(data)),
  showRecoveryModal: () => dispatch(showRecoveryModal()),
});

export default withRouter(connect(selector, actions)(Notifications));
