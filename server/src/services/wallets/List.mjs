import Base from '../Base';

import { Wallet } from '../../models';

export default class WalletsList extends Base {
  async execute() {
    const wallets = await Wallet.list({ userId: this.context.id });

    return {
      data: wallets.map(wallet => Wallet.format(wallet.get({ plain: true }))),
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['data'];
  }
}
