import Base from '../Base';
import X from '../Exception';
import { User, Wallet, Notification, Action, NewDeviceTwoFactor } from '../../models';

export default class UsersInfo extends Base {
  async execute() {
    const user = await User.findActive(this.context.id);

    if (!user) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
        },
      });
    }

    const userObj = user.json();
    userObj.secretSetNotification = false;
    userObj.fioWallets = userObj.fioWallets.map(item => Wallet.format(item));

    if (userObj.status === User.STATUS.NEW_EMAIL_NOT_VERIFIED) {
      const action = await Action.findOneWhere({
        data: { userId: this.context.id },
        type: Action.TYPE.UPDATE_EMAIL,
      });

      if (action != null) {
        userObj.newEmail = action.data.newEmail;
      }
    }

    if (!userObj.secretSet) {
      const secretSetNotification = await Notification.getItem({
        action: Notification.ACTION.RECOVERY,
        userId: user.id,
      });
      userObj.secretSetNotification = !!secretSetNotification;
    }

    if (userObj.newDeviceTwoFactor.length > 0) {
      const newDevicesValid = [];
      for (const newDeviceItem of userObj.newDeviceTwoFactor) {
        const isExpired = await NewDeviceTwoFactor.isExpired(newDeviceItem);
        if (!isExpired) newDevicesValid.push(newDeviceItem);
      }
      userObj.newDeviceTwoFactor = newDevicesValid;
    }

    return {
      data: userObj,
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['*'];
  }
}
