import Sequelize from 'sequelize';

import Base from './Base';

import { User } from './User';
import { PublicWalletData } from './PublicWalletData';

const { DataTypes: DT } = Sequelize;
import { WALLET_CREATED_FROM } from '../config/constants';

export class Wallet extends Base {
  static get CREATED_FROM() {
    return WALLET_CREATED_FROM;
  }

  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        publicKey: { type: DT.STRING, allowNull: false },
        edgeId: { type: DT.STRING, unique: true },
        name: { type: DT.STRING, allowNull: true },
        data: { type: DT.JSON },
        from: {
          type: DT.STRING,
          allowNull: false,
          defaultValue: Wallet.CREATED_FROM.EDGE,
        },
      },
      {
        sequelize,
        tableName: 'wallets',
        paranoid: true,
        timestamps: false,
        indexes: [
          {
            unique: true,
            fields: ['publicKey', 'userId'],
          },
        ],
      },
    );
  }

  static associate() {
    this.belongsTo(User, {
      foreignKey: 'userId',
      targetKey: 'id',
    });
    this.hasOne(PublicWalletData, {
      foreignKey: 'walletId',
      sourceKey: 'id',
      as: 'publicWalletData',
    });
  }

  static list(where) {
    return this.findAll({
      where,
      order: [['id', 'ASC']],
    });
  }

  static format({ id, publicKey, edgeId, name, data, from }) {
    return {
      id,
      edgeId,
      publicKey,
      name,
      data,
      from,
    };
  }
}
