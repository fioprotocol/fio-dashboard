import Sequelize from 'sequelize';

import Base from './Base.mjs';

import { User } from './User';
import { Var } from './Var';

import { fioApi } from '../external/fio.mjs';
import { getROE } from '../external/roe.mjs';

import logger from '../logger.mjs';

import { Domain } from './Domain.mjs';
import { ReferrerProfile } from './ReferrerProfile.mjs';
import { FioAccountProfile } from './FioAccountProfile.mjs';
import { FreeAddress } from './FreeAddress.mjs';

import { recalculateCartItems } from '../utils/cart.mjs';

import { CART_ITEM_TYPE } from '../config/constants.js';

const { DataTypes: DT } = Sequelize;

const CART_OPTIONS_UPDATE_TIMEOUT = 1000 * 60 * 15; // 15 min

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

  static async getCartOptions(cart, { checkPrices = false, seqOptions = null } = {}) {
    let { prices, roe, updatedAt } = cart.options || {};
    const updateRequired =
      !updatedAt || Var.updateRequired(updatedAt, CART_OPTIONS_UPDATE_TIMEOUT);
    if (!prices || !roe || updateRequired || checkPrices) {
      const newPrices = await fioApi.getPrices();
      const newRoe = await getROE();
      const newUpdatedAt = new Date();
      let updateCart = !!cart.id;

      // Update cart only when roe or prices changed
      if (updateCart && checkPrices && !updateRequired) {
        updateCart =
          roe !== newRoe ||
          prices.address !== newRoe.address ||
          prices.domain !== newRoe.domain ||
          prices.combo !== newRoe.combo ||
          prices.renewDomain !== newRoe.renewDomain ||
          prices.addBundles !== newRoe.addBundles ||
          !prices ||
          !roe;
      }

      roe = newRoe;
      prices = newPrices;
      updatedAt = newUpdatedAt;

      if (updateCart) {
        const values = { options: { prices, roe, updatedAt } };
        if (cart.items && cart.items.length) {
          values.items = recalculateCartItems({
            items: cart.items,
            prices,
            roe,
          });
        }
        await cart.update(values, seqOptions);
      }
    }

    return { prices, roe, updatedAt };
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
      await this.getCartOptions(cart, { checkPrices, seqOptions });
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

  static async getDataForCartItemsUpdate({
    refCode,
    noProfileResolvedUser,
    publicKey,
    userId,
    domain = null,
    items = null,
  }) {
    const dashboardDomains = refCode ? [] : await Domain.getDashboardDomains();
    const allRefProfileDomains = refCode
      ? await ReferrerProfile.getRefDomainsList({
          refCode,
        })
      : [];

    const userHasFreeAddress =
      !publicKey && !userId
        ? []
        : await FreeAddress.getItems(
            noProfileResolvedUser
              ? { userId: noProfileResolvedUser.id }
              : { publicKey, userId },
          );

    let userRefProfile = null;
    if (userId || noProfileResolvedUser) {
      let userRefProfileId = noProfileResolvedUser
        ? noProfileResolvedUser.refProfileId
        : null;
      if (userId) {
        const user = await User.findActive(userId);
        userRefProfileId = user.refProfileId;
      }
      if (userRefProfileId)
        userRefProfile = await ReferrerProfile.findOne({
          raw: true,
          where: { id: userRefProfileId },
        });
    }

    // Set if fch items has domain in fio account profile
    let freeDomainToOwner = {};
    if (domain) {
      freeDomainToOwner[domain] = await FioAccountProfile.getDomainOwner(domain);
    }
    if (items) {
      freeDomainToOwner = await FioAccountProfile.getDomainsOwner(
        items.reduce((acc, item) => {
          if (item.type === CART_ITEM_TYPE.ADDRESS) {
            acc.push(item.domain);
          }
          return acc;
        }, []),
      );
    }

    return {
      domainsList: [...dashboardDomains, ...allRefProfileDomains],
      userHasFreeAddress,
      userRefProfile,
      freeDomainToOwner,
      noAuth: !userId && !noProfileResolvedUser,
    };
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
