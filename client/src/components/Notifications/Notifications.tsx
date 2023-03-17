import React, { Component } from 'react';
import { RouterProps } from 'react-router-dom';

import NotificationBadge from '../NotificationBadge';

import {
  getDefaultContent,
  NOTIFICATIONS_CONTENT_TYPE,
} from '../../constants/notifications';

import { Notification } from '../../types';
import { NotificationsContainer } from './types';

import classes from './Notifications.module.scss';

const RELOAD_TIME = 3000;
const AUTOCLOSE_TIME = 5000;
export const ACTIONS = {
  RECOVERY: 'RECOVERY',
  CART_TIMEOUT: 'CART_TIMEOUT',
  EMAIL_CONFIRM: 'EMAIL_CONFIRM',
  RESET_ADMIN_USER_PASSWORD: 'RESET_ADMIN_USER_PASSWORD',
  DELETE_ADMIN_USER_SUCCESS: 'DELETE_ADMIN_USER_SUCCESS',
};

export default class Notifications extends Component<
  NotificationsContainer & RouterProps
> {
  notificationsInterval: ReturnType<typeof setInterval> | null;
  accountCreateCloseTimeout: ReturnType<typeof setTimeout> | null;

  componentDidMount(): void {
    this.notificationsInterval = setInterval(
      this.reloadNotifications,
      RELOAD_TIME,
    );
  }

  componentWillUnmount(): void {
    this.notificationsInterval && clearInterval(this.notificationsInterval);
    this.accountCreateCloseTimeout &&
      clearTimeout(this.accountCreateCloseTimeout);
  }

  getLatest = (): Notification => {
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
      if (
        !notification.title &&
        !getDefaultContent(notification.contentType, 'title')
      )
        continue;

      return notification;
    }
    return null;
  };

  reloadNotifications = (): void => {
    const { user, listNotifications } = this.props;

    if (user) {
      listNotifications();
    }
  };

  onBadgeClose = (last: Notification) => () => {
    const { update, removeManual } = this.props;
    if (last.isManual) {
      removeManual({ id: last.id, closeDate: new Date() });
    } else {
      update({ id: last.id, closeDate: new Date() });
    }
  };

  arrowAction = (last: Notification) => {
    const { showRecoveryModal } = this.props;
    if (!last) return null;
    if (!last.action) return null;
    if (last.action === ACTIONS.RECOVERY) return showRecoveryModal;

    return null;
  };

  handleAccountCreateBadgeClose = async (last: Notification) => {
    if (last.contentType === NOTIFICATIONS_CONTENT_TYPE.ACCOUNT_CREATE) {
      this.accountCreateCloseTimeout = setTimeout(
        this.onBadgeClose(last),
        AUTOCLOSE_TIME,
      );
    }
  };

  render(): React.ReactElement {
    const last = this.getLatest();
    if (!last) return null;

    this.handleAccountCreateBadgeClose(last);

    return (
      <div className={classes.container}>
        <NotificationBadge
          onClose={this.onBadgeClose(last)}
          arrowAction={this.arrowAction(last)}
          type={last.type}
          title={last.title || getDefaultContent(last.contentType, 'title')}
          message={
            last.message || getDefaultContent(last.contentType, 'message')
          }
          show
          hasNewDesign={
            last.contentType === NOTIFICATIONS_CONTENT_TYPE.ACCOUNT_CREATE
          }
        />
      </div>
    );
  }
}
