import sequelize from 'sequelize';
import { FIOSDK } from '@fioprotocol/fiosdk';

import Base from '../Base';
import { Order, User } from '../../models';
import { ADMIN_ROLES_IDS } from '../../config/constants.js';
import X from '../Exception.mjs';

const { Op } = sequelize;

const validateEmail = email => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );
};

const uuidv4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const validateUserId = userId => uuidv4Regex.test(userId);

export default class Search extends Base {
  static get requiredPermissions() {
    return [ADMIN_ROLES_IDS.ADMIN, ADMIN_ROLES_IDS.SUPER_ADMIN];
  }

  static get validationRules() {
    return {
      name: 'string',
    };
  }

  async execute({ name }) {
    const valueToSearch = name.trim();

    if (!valueToSearch) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          name: 'NOT_FOUND',
        },
      });
    }

    const isEmail = validateEmail(valueToSearch);
    const isUserId = validateUserId(valueToSearch);
    let isFioAddress = false;
    let isDomain = false;
    let isPublicKey = false;

    try {
      FIOSDK.isFioAddressValid(valueToSearch);
      isFioAddress = true;
    } catch (e) {
      //
    }

    try {
      FIOSDK.isFioDomainValid(valueToSearch);
      isDomain = true;
    } catch (e) {
      //
    }

    try {
      FIOSDK.isFioPublicKeyValid(valueToSearch);
      isPublicKey = true;
    } catch (e) {
      //
    }

    const result = {
      users: [],
      orders: [],
    };

    if (isEmail) {
      const orders = await Order.listSearchByUserEmail(valueToSearch);
      result.orders = [...result.orders, ...orders];
    }

    if (isUserId) {
      const orders = await Order.listSearchByUserId(valueToSearch);
      result.orders = [...result.orders, ...orders];
    }

    if (isFioAddress) {
      const fioAddressParts = valueToSearch.split('@');

      const orders = await Order.listSearchByFioAddressItems(
        fioAddressParts[1],
        fioAddressParts[0],
      );

      result.orders = [...result.orders, ...orders];
    }

    if (isDomain) {
      const orders = await Order.listSearchByFioAddressItems(valueToSearch);
      result.orders = [...result.orders, ...orders];
    }

    if (isPublicKey) {
      const orders = await Order.listSearchByPublicKey(valueToSearch);
      result.orders = [...result.orders, ...orders];
    }

    if (!isEmail && !isFioAddress && !isPublicKey && !isUserId) {
      const orders = await Order.listSearchByNumber(valueToSearch);
      result.orders = [...result.orders, ...orders];
    }

    return {
      data: {
        result,
      },
    };
  }

  async userSearch({ userIdsArray, emailAddress }) {
    if (userIdsArray)
      return User.findAll({
        where: {
          id: {
            [Op.in]: userIdsArray,
          },
        },
      }).map(u => u.json());

    if (emailAddress)
      return User.findAll({
        where: {
          email: {
            [Op.like]: `%${emailAddress}%`,
          },
        },
      }).map(u => u.json());

    return [];
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
