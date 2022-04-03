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

export default withRouter(
  connect(selector, {
    update: updateNotification,
    listNotifications,
    removeManual,
    showRecoveryModal,
  })(Notifications),
);
