import Base from '../Base';

import { User } from '../../models';

import { sendSendinblueEvent } from '../external/SendinblueEvent.mjs';

export default class SendEvent extends Base {
  static get validationRules() {
    return {
      event: ['required'],
    };
  }

  async execute({ event }) {
    if (this.context.id) {
      const user = await User.findActive(this.context.id);

      await sendSendinblueEvent({ event, user });
    }

    return { data: { success: true } };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
