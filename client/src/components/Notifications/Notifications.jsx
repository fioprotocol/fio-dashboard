import React, { Component } from 'react';
import NotificationBadge from '../NotificationBadge';
import classes from './Notifications.module.scss';

const RELOAD_TIME = 3000;
export const ACTIONS = {
  RECOVERY: 'RECOVERY',
  CART_TIMEOUT: 'CART_TIMEOUT',
};

export default class Notifications extends Component {
  componentDidMount() {
    this.notificationsInterval = setInterval(
      this.reloadNotifications,
      RELOAD_TIME,
    );
  }

  componentWillUnmount() {
    this.notificationsInterval && clearInterval(this.notificationsInterval);
  }

  getLatest = () => {
    const { list } = this.props;
    const {
      history: {
        location: { pathname },
      },
    } = this.props;
    for (const notification of list) {
      if (
        notification.pagesToShow &&
        notification.pagesToShow.indexOf(pathname) < 0
      )
        continue;
      if (notification.closeDate) continue;
      return notification;
    }
    return null;
  };

  reloadNotifications = () => {
    const { user, listNotifications } = this.props;

    if (user) {
      listNotifications();
    }
  };

  onBadgeClose = last => () => {
    const { update, removeManual } = this.props;
    if (last.isManual) {
      removeManual({ id: last.id, closeDate: new Date() });
    } else {
      update({ id: last.id, closeDate: new Date() });
    }
  };

  arrowAction = last => {
    const { showRecoveryModal } = this.props;
    if (!last) return null;
    if (!last.action) return null;
    if (last.action === ACTIONS.RECOVERY) return showRecoveryModal;

    return null;
  };

  render() {
    const last = this.getLatest();
    if (!last) return null;

    return (
      <div className={classes.container}>
        <NotificationBadge
          onClose={this.onBadgeClose(last)}
          arrowAction={this.arrowAction(last)}
          type={last.type}
          title={last.title}
          message={last.message}
          show
        />
      </div>
    );
  }
}
