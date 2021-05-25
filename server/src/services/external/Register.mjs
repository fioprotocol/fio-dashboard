import logger from '../../logger';
import Base from '../Base';
import { FioRegApi } from '../../external/fio-reg';

export default class Register extends Base {
  static get validationRules() {
    return {
      data: {
        nested_object: {
          address: ['required', 'string'],
          publicKey: ['required', 'string'],
        },
      },
    };
  }

  async execute({ data: { address, publicKey } }) {
    try {
      const res = await FioRegApi.register({
        address,
        publicKey,
      });

      console.log(res);
      return { data: res };
    } catch (error) {
      logger.error(`Register error: ${error}`);
      return {
        data: { success: false, error },
      };
    }
  }

  static get paramsSecret() {
    return ['address', 'publicKey'];
  }

  static get resultSecret() {
    return [];
  }
}
