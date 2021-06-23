import React, { Component } from 'react';
import classnames from './DashboardPage.module.scss';

export default class DashboardPage extends Component {
  state = {
    fioWalletKey: '',
  };

  componentDidMount() {
    this.getFioWallet();
  }

  getFioWallet = async () => {
    const { account } = this.props;
    try {
      // Find the app wallet, or create one if necessary:
      const walletInfo = account.getFirstWalletInfo('wallet:fio');
      const wallet =
        walletInfo == null
          ? await account.createCurrencyWallet('wallet:fio')
          : await account.waitForCurrencyWallet(walletInfo.id);
      this.setState({ fioWalletKey: wallet.getDisplayPublicSeed() });
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    const { user } = this.props;
    const { fioWalletKey } = this.state;
    return (
      <div className={classnames.container}>
        <br />
        <br />
        <h3>Dashboard</h3>
        <p>
          Hi, <i>{user && user.email}</i>
        </p>
        <p>Fio Wallet Key: {fioWalletKey || '-'}</p>
      </div>
    );
  }
}
