import Base from '../Base';
import X from '../Exception';
import {
  Cart,
  DomainsWatchlist,
  User,
  UserDevice,
  Nonce,
  Notification,
  Wallet,
  NewDeviceTwoFactor,
  Order,
} from '../../models';

export default class UserDelete extends Base {
  static get validationRules() {
    return {
      nonce: [
        'required',
        {
          nested_object: {
            signatures: ['required', { list_of: 'string' }],
            challenge: ['required', 'string'],
          },
        },
      ],
    };
  }

  async execute({ nonce }) {
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

    if (!(await Nonce.verify({ ...nonce, userId: this.context.id }))) {
      throw new X({
        code: 'AUTHENTICATION_FAILED',
        fields: {},
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
      await Wallet.destroy(destroyCondition);
      await NewDeviceTwoFactor.destroy(destroyCondition);
      await DomainsWatchlist.destroy(destroyCondition);
      await UserDevice.destroy(destroyCondition);

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

      await User.destroy({
        where: { id: user.id },
        force: true,
        transaction: t,
      });
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
