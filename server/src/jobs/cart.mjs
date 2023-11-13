import Sequelize from 'sequelize';

import '../db';
import { Cart } from '../models/index.mjs';

import CommonJob from './job.mjs';

class CartJob extends CommonJob {
  async execute() {
    const currentDate = new Date();
    const twentyFourHoursFromNow = new Date(currentDate);
    twentyFourHoursFromNow.setHours(currentDate.getHours() - 24);

    this.postMessage(`Processing clear cart older then - ${twentyFourHoursFromNow}`);

    const rowsDeleted = await Cart.destroy({
      where: { createdAt: { [Sequelize.Op.lt]: twentyFourHoursFromNow } },
    });

    this.postMessage(`Cleared ${rowsDeleted} carts`);

    this.finish();
  }
}

new CartJob().execute();
