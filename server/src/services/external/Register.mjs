import logger from '../../logger';
import Base from '../Base';
import { FioRegApi } from '../../external/fio-reg';
import { validate } from '../../external/captcha';

export default class Register extends Base {
  static get validationRules() {
    return {
      data: {
        nested_object: {
          address: ['required', 'string'],
          publicKey: ['required', 'string'],
          verifyParams: {
            nested_object: {
              geetest_challenge: ['required', 'string'],
              geetest_validate: ['required', 'string'],
              geetest_seccode: ['required', 'string'],
            },
          },
        },
      },
    };
  }

  async execute({ data: { address, publicKey, verifyParams } }) {
    try {
      await validate(verifyParams);
    } catch (error) {
      return {
        data: { error },
      };
    }
    // todo: check if user has free address here
    try {
      const res = await FioRegApi.register({
        address,
        publicKey,
      });

      return { data: res };
    } catch (error) {
      let message = error.message;
      if (error.response && error.response.body) {
        message = error.response.body.message;
      }
      logger.error(`Register free address error: ${message}`);
      return {
        data: { error: message },
      };
    }
  }

  static get paramsSecret() {
    return ['address', 'publicKey', 'verifyParams'];
  }

  static get resultSecret() {
    return [];
  }
}
