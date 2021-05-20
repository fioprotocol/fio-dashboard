import React, { Component } from 'react';
import NotificationBadge from '../NotificationBadge';
import classes from './Notifications.module.scss';

const RELOAD_TIME = 3000;
export const ACTIONS = {
  RECOVERY: 'RECOVERY',
};

export default class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      last: null,
    };
  }

  componentDidMount() {
    this.notificationsInterval = setInterval(
      this.reloadNotifications,
      RELOAD_TIME,
    );
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.list.length &&
      this.props.list.length &&
      prevProps.list[0] &&
      prevProps.list[0].id !== this.props.list[0].id
    ) {
      this.setState({ last: this.props.list[0] });
    }
    if (!prevProps.list.length && this.props.list.length) {
      this.setState({ last: this.props.list[0] });
    }
    if (prevProps.list.length && !this.props.list.length) {
      this.setState({ last: null });
    }
  }

  componentWillUnmount() {
    this.notificationsInterval && clearInterval(this.notificationsInterval);
  }

  reloadNotifications = () => {
    const { user, listNotifications } = this.props;

    if (user) {
      listNotifications();
    }
  };

  onBadgeClose = () => {
    const { update } = this.props;
    const { last } = this.state;
    update({ id: last.id, closeDate: new Date() });
    this.setState({ last: null });
  };

  arrowAction = () => {
    const { showRecoveryModal } = this.props;
    const { last } = this.state;
    if (!last) return null;
    if (!last.action) return null;
    if (last.action === ACTIONS.RECOVERY) return showRecoveryModal;

    return null;
  };

  render() {
    const { user } = this.props;
    const { last } = this.state;
    if (!user) return null;
    if (!last) return null;
    if (last.closeDate) return null;

    return (
      <div className={classes.container}>
        <NotificationBadge
          onClose={this.onBadgeClose}
          arrowAction={this.arrowAction()}
          type={last.type}
          title={last.title}
          message={last.message}
        />
      </div>
    );
  }
}
