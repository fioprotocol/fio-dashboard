import Sequelize from 'sequelize';

import Base from './Base.mjs';

import { User } from './User';
import logger from '../logger.mjs';
import { getCartOptions } from '../utils/cart.mjs';

const { DataTypes: DT } = Sequelize;

export class Cart extends Base {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DT.UUID,
          primaryKey: true,
          defaultValue: DT.UUIDV4,
        },
        items: {
          type: DT.JSON,
        },
        options: {
          type: DT.JSON,
          allowNull: true,
        },
        userId: {
          type: DT.UUID,
          references: {
            model: 'users',
            key: 'id',
          },
          onUpdate: 'cascade',
          allowNull: true,
        },
        guestId: {
          type: DT.UUID,
          allowNull: true,
        },
        publicKey: {
          type: DT.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'cart',
        timestamps: true,
      },
    );
  }

  static associate() {
    this.belongsTo(User, {
      foreignKey: 'userId',
      targetKey: 'id',
    });
  }

  static async getActive(
    { userId, guestId, withOpt = true, checkPrices = false },
    seqOptions = {},
  ) {
    const where = {};
    if (userId) where.userId = userId;
    if (guestId) where.guestId = guestId;

    const cart = this.findOne({ where, ...seqOptions });

    if (cart && withOpt) {
      await getCartOptions(cart, { checkPrices, seqOptions });
    }

    return cart;
  }

  static async updateGuestCartUser(userId, guestId) {
    try {
      if (await this.findOne({ where: { guestId } })) {
        await this.destroy({ where: { userId } });
        await this.update({ userId, guestId: null }, { where: { guestId } });
      }
    } catch (e) {
      logger.error(e);
    }
  }

  static attrs(type = 'default') {
    const attributes = {
      default: ['id', 'items', 'publicKey', 'userId'],
    };

    if (type in attributes) {
      return attributes[type];
    }

    return attributes.default;
  }

  static format({ id, items, publicKey, options }) {
    return { id, items, publicKey, options };
  }
}
