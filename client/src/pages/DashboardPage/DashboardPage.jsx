import React, { Component } from 'react';
import classnames from './DashboardPage.module.scss';

export default class DashboardPage extends Component {
  render() {
    const { user, fioWallets } = this.props;
    return (
      <div className={classnames.container}>
        <br />
        <br />
        <h3>Dashboard</h3>
        <p>
          Hi, <i>{user && user.email}</i>
        </p>
        <br />
        <br />
        <h5>Your fio wallets:</h5>
        <div className={classnames.table}>
          {fioWallets.length
            ? fioWallets.map(({ id, name, publicKey }) => (
                <p key={id}>
                  {name}: <i>{publicKey}</i>
                </p>
              ))
            : '-'}
        </div>
      </div>
    );
  }
}
