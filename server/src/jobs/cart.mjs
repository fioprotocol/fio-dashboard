import Sequelize from 'sequelize';

import '../db';
import { Cart } from '../models/index.mjs';

import CommonJob from './job.mjs';

const CLEAR_CART_TIME_PERIOD_IN_MINUTES =
  process.env.CLEAR_CART_TIME_PERIOD_IN_MINUTES || 1440;

class CartJob extends CommonJob {
  async execute() {
    const currentDate = new Date();
    const timeFromNow = new Date(currentDate);
    timeFromNow.setMinutes(currentDate.getMinutes() - CLEAR_CART_TIME_PERIOD_IN_MINUTES);

    this.postMessage(`Processing clear cart older then - ${timeFromNow}`);

    const rowsDeleted = await Cart.destroy({
      where: { createdAt: { [Sequelize.Op.lt]: timeFromNow } },
    });

    this.postMessage(`Cleared ${rowsDeleted} carts`);

    this.finish();
  }
}

new CartJob().execute();
