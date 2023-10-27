import Base from '../Base';
import X from '../Exception';

import { Cart } from '../../models/Cart.mjs';

import logger from '../../logger.mjs';

export default class AddItem extends Base {
  static get validationRules() {
    return {
      id: ['string'],
      item: [
        'required',
        {
          nested_object: {
            address: ['string'],
            allowFree: ['boolean'],
            costFio: ['required', 'string'],
            costNativeFio: ['required', 'string'],
            costUsdc: ['required', 'string'],
            domain: ['required', 'string'],
            domainType: ['required', 'string'],
            id: ['required', 'string'],
            nativeFioAddressPrice: ['required', 'string'],
            period: ['required', 'string'],
            type: ['required', 'string'],
          },
        },
      ],
    };
  }

  async execute({ id, item }) {
    try {
      const userId = this.context.id || null;
      const existingCart = await Cart.findById(id);

      if (!existingCart) {
        const cart = await Cart.create({ items: [item], userId });

        return { data: Cart.format(cart.get({ plain: true })) };
      }

      const items = existingCart.items;

      const updatedItems = items.push(item);

      await existingCart.update({ items: updatedItems, userId });

      return {
        data: Cart.format(existingCart.get({ plain: true })),
      };
    } catch (error) {
      logger.error(error);
      throw new X({
        code: 'CART_UPDATE',
        fields: {
          deleteItem: 'CANNOT DELETE CART ITEM',
        },
      });
    }
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
