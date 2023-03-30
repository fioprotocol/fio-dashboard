import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';

import { showRecoveryModal } from '../../redux/modal/actions';
import {
  listNotifications,
  updateNotification,
  removeManual,
} from '../../redux/notifications/actions';

import { showRecovery } from '../../redux/modal/selectors';
import { list } from '../../redux/notifications/selectors';
import { user } from '../../redux/profile/selectors';

import Notifications from './Notifications';

const selector = createStructuredSelector({
  list,
  showRecovery,
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
