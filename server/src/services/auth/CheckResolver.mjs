import Base from '../Base';
import X from '../Exception.mjs';
import { verify } from './authToken.mjs';

export default class AuthCheckResolver extends Base {
  static get validationRules() {
    return {
      token: ['required', 'string'],
      supportedTypes: { list_of: ['string'] },
    };
  }

  async execute({ token, supportedTypes }) {
    let tokenData;

    try {
      tokenData = await verify(token);
    } catch (e) {
      throw new X({
        code: 'PERMISSION_DENIED',
        fields: {
          token: 'WRONG_TOKEN',
        },
      });
    }

    const { type, ...payload } = tokenData;

    if (!supportedTypes.includes(type)) {
      throw new X({
        code: 'PERMISSION_DENIED',
        fields: {
          supportedTypes: 'NOT_SUPPORTED',
        },
      });
    }

    return { type, payload };
  }

  static get paramsSecret() {
    return ['token'];
  }

  static get resultSecret() {
    return ['*'];
  }
}
