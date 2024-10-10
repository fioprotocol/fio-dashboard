import Base from '../Base';

export default class AuthCheckGuest extends Base {
  static get validationRules() {
    return {
      id: ['required', 'string'],
    };
  }

  async execute({ id }) {
    return { guestId: id };
  }

  static get paramsSecret() {
    return ['token'];
  }

  static get resultSecret() {
    return ['*'];
  }
}
