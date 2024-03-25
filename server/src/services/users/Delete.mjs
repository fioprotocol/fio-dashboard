import Base from '../Base';
import X from '../Exception';
import {
  Cart,
  DomainsWatchlist,
  User,
  Nonce,
  Notification,
  Wallet,
  FreeAddress,
  NewDeviceTwoFactor,
  Order,
} from '../../models';

export default class UserDelete extends Base {
  async execute() {
    const user = await User.findActive(this.context.id);
    const deletedUser = await User.findDeletedUser();

    if (!user) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
        },
      });
    }

    await User.sequelize.transaction(async t => {
      const destroyCondition = {
        where: {
          userId: user.id,
        },
        force: true,
        transaction: t,
      };

      await Nonce.destroy(destroyCondition);
      await Notification.destroy(destroyCondition);
      await FreeAddress.destroy(destroyCondition);
      await Wallet.destroy(destroyCondition);
      await NewDeviceTwoFactor.destroy(destroyCondition);
      await DomainsWatchlist.destroy(destroyCondition);

      await Order.update(
        { userId: deletedUser.id },
        {
          where: {
            userId: user.id,
          },
          transaction: t,
        },
      );

      await Cart.update(
        { userId: null },
        {
          where: {
            userId: user.id,
          },
          transaction: t,
        },
      );

      await user.destroy({ force: true, transaction: t });
    });

    return {
      data: { success: true },
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['*'];
  }
}
