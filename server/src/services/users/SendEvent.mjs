import Base from '../Base';
import marketingMailchimp from '../../external/marketing-mailchimp';
import { User } from '../../models';

export default class SendEvent extends Base {
  static get validationRules() {
    return {
      event: ['required'],
    };
  }

  async execute({ event }) {
    const user = await User.findActive(this.context.id);

    if (user.isOptIn) {
      await marketingMailchimp.sendEvent(user.email, event);
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
