import superagent from 'superagent';

import logger from '../../logger';
import Base from '../Base';
import X from '../Exception';

export default class GetUrlContent extends Base {
  static get validationRules() {
    return {
      url: ['string'],
    };
  }

  async execute({ url }) {
    try {
      const response = await superagent.get(url);

      return { data: response.text || null };
    } catch (error) {
      logger.error(`Get url content: ${error}`);
      throw new X({
        code: 'SERVER_ERROR',
        fields: {
          getUrlContnet: 'SERVER_ERROR',
        },
      });
    }
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['*'];
  }
}
