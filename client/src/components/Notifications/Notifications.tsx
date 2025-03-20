import { FC, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import NotificationBadge from '../NotificationBadge';

import {
  getDefaultContent,
  NOTIFICATIONS_CONTENT_TYPE,
} from '../../constants/notifications';

import { showRecovery as showRecoverySelector } from '../../redux/modal/selectors';
import { list as listNotificationsSelector } from '../../redux/notifications/selectors';
import { userId as userIdSelector } from '../../redux/profile/selectors';

import {
  listNotifications,
  updateNotification,
  removeManual,
} from '../../redux/notifications/actions';

import { Notification } from '../../types';

import classes from './Notifications.module.scss';

const AUTOCLOSE_TIME = 5000;

const getLatest = (
  list: Notification[],
  pathname: string,
): Notification | null => {
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

const arrowAction = (last: Notification): (() => void | null) => {
  if (!last) return null;
  if (!last.action) return null;
  // check action type and return any action you need
  return null;
};

export const Notifications: FC = () => {
  const accountCreateCloseTimeout = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  const list = useSelector(listNotificationsSelector);
  const userId = useSelector(userIdSelector);
  const showRecovery = useSelector(showRecoverySelector);

  const location = useLocation();
  const dispatch = useDispatch();

  const last = useMemo(() => getLatest(list, location?.pathname ?? ''), [
    list,
    location?.pathname,
  ]);

  const onBadgeClose = useCallback(
    (last: Notification) => () => {
      if (last.isManual) {
        dispatch(removeManual({ id: last.id, closeDate: new Date() }));
      } else {
        dispatch(updateNotification({ id: last.id, closeDate: new Date() }));
      }
    },
    [dispatch],
  );

  const handleAccountCreateBadgeClose = useCallback(
    (last: Notification): void => {
      if (
        last.contentType === NOTIFICATIONS_CONTENT_TYPE.ACCOUNT_CREATE &&
        !showRecovery
      ) {
        accountCreateCloseTimeout.current = setTimeout(
          onBadgeClose(last),
          AUTOCLOSE_TIME,
        );
      }
    },
    [showRecovery, onBadgeClose],
  );

  useEffect(() => {
    if (userId) {
      dispatch(listNotifications());
    }
  }, [userId, dispatch]);

  useEffect(() => {
    return () => {
      if (accountCreateCloseTimeout.current) {
        clearTimeout(accountCreateCloseTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (last) {
      handleAccountCreateBadgeClose(last);
    }
  }, [last, handleAccountCreateBadgeClose]);

  if (!last) return null;

  return (
    <div className={classes.container}>
      <NotificationBadge
        onClose={onBadgeClose(last)}
        arrowAction={arrowAction(last)}
        type={last.type}
        title={last.title || getDefaultContent(last.contentType, 'title')}
        message={last.message || getDefaultContent(last.contentType, 'message')}
        show
        hasNewDesign={
          last.contentType === NOTIFICATIONS_CONTENT_TYPE.ACCOUNT_CREATE
        }
      />
    </div>
  );
};
