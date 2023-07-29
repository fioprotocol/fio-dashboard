import Sequelize from 'sequelize';

import Base from './Base';

import { User } from './User';

const { DataTypes: DT } = Sequelize;

export class DomainsWatchlist extends Base {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DT.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },
        domain: {
          type: DT.STRING,
          allowNull: false,
        },
        userId: {
          type: DT.UUID,
          references: {
            model: 'users',
            key: 'id',
          },
          onUpdate: 'cascade',
          onDelete: 'set null',
          allowNull: false,
        },
        createdAt: { type: DT.DATE },
        updatedAt: { type: DT.DATE },
        deletedAt: { type: DT.DATE },
      },
      {
        sequelize,
        tableName: 'domains-watchlist',
        paranoid: true,
      },
    );
  }

  static associate() {
    this.belongsTo(User, {
      foreignKey: 'userId',
      targetKey: 'id',
      as: 'domainsWatchlist',
    });
  }

  static attrs(type = 'default') {
    const attributes = {
      default: ['id', 'domain', 'createdAt'],
    };

    if (type in attributes) {
      return attributes[type];
    }

    return attributes.default;
  }

  static async list({ userId }) {
    const where = { userId };

    return this.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });
  }

  static async listAll() {
    const domainsWatchlist = await this.findAll({
      order: [['id', 'DESC']],
    });

    return domainsWatchlist.map(domainsWatchlistItem =>
      this.format(domainsWatchlistItem),
    );
  }

  static format({ id, domain, createdAt, userId }) {
    return {
      id,
      domain,
      createdAt,
      userId,
    };
  }
}
