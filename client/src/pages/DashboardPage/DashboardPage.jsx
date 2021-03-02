import React, { Component } from 'react';
import classnames from './DashboardPage.module.scss';

export default class DashboardPage extends Component {
  render() {
    const { account } = this.props
    return (
      <div className={classnames.container}>
        <br />
        <br />
        <h3>Dashboard</h3>
        <p>{account.username}</p>
      </div>
    );
  }
}
