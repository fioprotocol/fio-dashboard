import { FIOSDK } from '@fioprotocol/fiosdk';

import Base from '../Base';
import { Order } from '../../models';
import { ADMIN_ROLES_IDS } from '../../config/constants.js';
import X from '../Exception.mjs';

// const { Op } = sequelize;

const validateEmail = email => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );
};

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
    if (!name) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          name: 'NOT_FOUND',
        },
      });
    }

    const isEmail = validateEmail(name);
    let isFioAddress = false;
    let isDomain = false;
    let isPublicKey = false;

    try {
      FIOSDK.isFioAddressValid(name);
      isFioAddress = true;
    } catch (e) {
      //
    }

    try {
      FIOSDK.isFioDomainValid(name);
      isDomain = true;
    } catch (e) {
      //
    }

    try {
      FIOSDK.isFioPublicKeyValid(name);
      isPublicKey = true;
    } catch (e) {
      //
    }

    const result = {
      users: [],
      orders: [],
    };

    if (isEmail) {
      // could be useful in future
      // const usersProfiles = await User.findAll({
      //   where: {
      //     email: {
      //       [Op.like]: `%${name}%`,
      //     },
      //   },
      // });
      // result.users = usersProfiles.map(user => user.json());

      const orders = await Order.listSearchByUserEmail(name);
      result.orders = [...result.orders, ...orders];
    }

    if (isFioAddress) {
      const fioAddressParts = name.split('@');

      const orders = await Order.listSearchByFioAddressItems(
        fioAddressParts[1],
        fioAddressParts[0],
      );

      result.orders = [...result.orders, ...orders];

      // const usersProfiles = await User.findAll({
      //   where: {
      //     id: {
      //       [Op.in]: orders.map(o => o.userId),
      //     },
      //   },
      // }).map(u => u.json());
      // result.users = [...result.users, ...usersProfiles];
    }

    if (isDomain) {
      const orders = await Order.listSearchByFioAddressItems(name);
      result.orders = [...result.orders, ...orders];

      // const usersProfiles = await User.findAll({
      //   where: {
      //     id: {
      //       [Op.in]: orders.map(o => o.userId),
      //     },
      //   },
      // }).map(u => u.json());
      // result.users = [...result.users, ...usersProfiles];
    }

    if (isPublicKey) {
      const orders = await Order.listSearchByPublicKey(name);
      result.orders = [...result.orders, ...orders];
    }

    return {
      data: {
        result,
      },
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
