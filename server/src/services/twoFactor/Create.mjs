import superagent from 'superagent';

import Base from '../Base';

import { NewDeviceTwoFactor, User } from '../../models';

import emailSender from '../emailSender.mjs';
import { templates } from '../../emails/emailTemplate.mjs';

import config from '../../config/index.mjs';

import logger from '../../logger.mjs';

export default class NewDeviceTwoFactorCreate extends Base {
  static get validationRules() {
    return {
      data: [
        'required',
        {
          nested_object: {
            email: ['required', 'trim', 'email', 'to_lc'],
            voucherId: ['required', 'string'],
            loginId: ['required', 'string'],
            deviceDescription: ['required', 'string'],
          },
        },
      ],
    };
  }

  async execute({ data: { email, voucherId, loginId, deviceDescription } }) {
    const user = await User.findOneWhere({ email });
    if (!user) return { data: null };

    try {
      const res = await superagent
        .post(`${config.edge.loginApiUrl}messages`)
        .set('Authorization', `Token ${config.edge.loginApiKey}`)
        .send({ loginIds: [loginId] });

      if (res.body.message !== 'Success') {
        return { data: null };
      }

      const login = res.body.results.find(
        r =>
          r.loginId === loginId &&
          r.pendingVouchers.some(pv => pv.voucherId === voucherId),
      );

      if (!login) return { data: null };
    } catch (err) {
      logger.error(err);
      return { data: null };
    }

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

    await emailSender.send(templates.deviceApproveRequested, user.email);

    return { data: null };
  }

  static get paramsSecret() {
    return ['data.email', 'data.voucherId', 'data.deviceDescription', 'data.loginId'];
  }

  static get resultSecret() {
    return [];
  }
}
