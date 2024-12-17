import Base from '../Base';
import X from '../Exception';
import { User, Wallet, NewDeviceTwoFactor } from '../../models';

export default class UsersInfo extends Base {
  async execute() {
    const user = await User.getInfo(this.context.id);

    if (!user) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
        },
      });
    }

    const userObj = user.json();
    userObj.fioWallets = userObj.fioWallets.map(item => Wallet.format(item));

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
