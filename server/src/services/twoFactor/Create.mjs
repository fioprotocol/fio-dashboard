import Base from '../Base';

import { NewDeviceTwoFactor, User } from '../../models';

import emailSender from '../emailSender.mjs';
import { templates } from '../../emails/emailTemplate.mjs';

export default class NewDeviceTwoFactorCreate extends Base {
  static get validationRules() {
    return {
      data: [
        'required',
        {
          nested_object: {
            email: ['required', 'trim', 'email', 'to_lc'],
            voucherId: ['required', 'string'],
            deviceDescription: ['required', 'string'],
          },
        },
      ],
    };
  }

  async execute({ data: { email, voucherId, deviceDescription } }) {
    const user = await User.findOneWhere({ email });
    if (!user) return { data: null };

    const existing = await NewDeviceTwoFactor.getItem({
      userId: user.id,
      voucherId,
    });

    if (existing && existing.id) return { data: null };

    const newDeviceTwoFactor = new NewDeviceTwoFactor({
      userId: user.id,
      voucherId,
      deviceDescription,
    });

    await newDeviceTwoFactor.save();

    // todo: prevent of sending multiple emails when abusing the api route with random voucherIds
    await emailSender.send(templates.deviceApproveRequested, user.email);

    return { data: null };
  }

  static get paramsSecret() {
    return ['data.email', 'data.voucherId', 'data.deviceDescription'];
  }

  static get resultSecret() {
    return [];
  }
}
