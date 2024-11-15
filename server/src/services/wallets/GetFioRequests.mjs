import Base from '../Base';

import { PublicWalletData, Wallet } from '../../models';

export default class GetFioRequests extends Base {
  async execute() {
    const publicWalletData = await PublicWalletData.findAll({
      include: [
        {
          model: Wallet,
          required: true,
          where: {
            userId: this.context.id,
          },
          attributes: ['id', 'publicKey'],
        },
      ],
      attributes: ['requests'],
    });

    const formattedData = publicWalletData.reduce((acc, walletData) => {
      const publicKey = walletData.Wallet.publicKey;

      if (!acc[publicKey]) {
        acc[publicKey] = {
          sent: [],
          received: [],
        };
      }

      if (walletData.requests) {
        acc[publicKey] = walletData.requests;
      }

      return acc;
    }, {});

    return {
      data: formattedData,
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
