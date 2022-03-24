import Sequelize from 'sequelize';

import Base from './Base';

import { Wallet } from './Wallet';

const { DataTypes: DT } = Sequelize;

export class PublicWalletData extends Base {
  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        balance: { type: DT.STRING },
        requests: { type: DT.JSON },
        obtData: { type: DT.JSON },
        cryptoHandles: { type: DT.JSON },
        domains: { type: DT.JSON },
        meta: { type: DT.JSON },
      },
      {
        sequelize,
        tableName: 'public-wallet-data',
        paranoid: true,
        timestamps: false,
      },
    );
  }

  static associate() {
    this.belongsTo(Wallet, {
      foreignKey: 'walletId',
      targetKey: 'id',
    });
  }

  static format({ id, walletId, balance }) {
    return {
      id,
      walletId,
      balance,
    };
  }
}
