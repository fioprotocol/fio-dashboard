import Sequelize from 'sequelize';

import Base from './Base';

import { User } from './User';
import { Wallet } from './Wallet.mjs';

const { DataTypes: DT, Op } = Sequelize;

export class FreeAddress extends Base {
  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        name: { type: DT.STRING, allowNull: false },
        publicKey: { type: DT.STRING },
        userId: { type: DT.STRING, allowNull: true },
      },
      {
        sequelize,
        tableName: 'free-addresses',
        paranoid: true,
      },
    );
  }

  static associate() {
    this.belongsTo(User, {
      foreignKey: 'userId',
      targetKey: 'id',
      as: 'freeAddresses',
    });
  }

  static async getItems(params) {
    const { userId, publicKey, ...otherParams } = params;
    let where = { ...otherParams };
    const usersPublicKeys = [];
    const userIds = [];

    if (userId) {
      const wallets = await Wallet.list({ userId });
      if (wallets && wallets.length > 0) {
        for (const wallet of wallets) {
          usersPublicKeys.push(wallet.publicKey);
        }
      }
    }

    if (publicKey) {
      if (!userId) {
        const wallets = await Wallet.list({ publicKey });

        if (wallets && wallets.length > 0) {
          for (const wallet of wallets) {
            userIds.push(wallet.userId);
          }
        }
      }
      usersPublicKeys.push(publicKey);
    }

    if (userId && usersPublicKeys.length > 0) {
      where = {
        ...where,
        [Op.or]: [
          { userId },
          {
            publicKey: {
              [Op.in]: usersPublicKeys,
            },
          },
        ],
      };
    } else if (userId && !usersPublicKeys.length) {
      where = {
        ...where,
        userId,
      };
    } else if (!userId && usersPublicKeys.length > 0 && !userIds.length) {
      where = {
        ...where,
        publicKey: {
          [Op.in]: usersPublicKeys,
        },
      };
    } else if (!userId && usersPublicKeys.length > 0 && userIds.length > 0) {
      where = {
        ...where,
        [Op.or]: [
          {
            userId: {
              [Op.in]: [...new Set(userIds)],
            },
          },
          {
            publicKey: {
              [Op.in]: usersPublicKeys,
            },
          },
        ],
      };
    }

    return this.findAll({ where });
  }

  static format({ id, name, publicKey, createdAt, userId }) {
    return {
      id,
      name,
      publicKey,
      createdAt,
      userId,
    };
  }

  static formatMinimal({ name }) {
    return { name };
  }
}
