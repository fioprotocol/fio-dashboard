import superagent from 'superagent';

import Base from '../Base';

import { MINUTE_MS } from '../../config/constants';
import logger from '../../logger';

export default class CheckServerTime extends Base {
  static get validationRules() {
    return {
      fioApiUrls: [
        'required',
        {
          or: ['string', { list_of: 'string' }],
        },
      ],
    };
  }
  async execute({ fioApiUrls }) {
    // Normalize fioApiUrls to always be an array
    const urlsArray = Array.isArray(fioApiUrls) ? fioApiUrls : [fioApiUrls];
    const checkedUrls = [];
    const checkUrl = async (apiUrl, index) => {
      try {
        const response = await superagent.get(`${apiUrl}chain/get_info`);

        const { head_block_time } = response.body;

        if (new Date().getTime() - new Date(head_block_time + 'Z').getTime() < MINUTE_MS)
          checkedUrls[index] = apiUrl;
      } catch (err) {
        logger.error(err.message);
      }
    };
    await Promise.allSettled(urlsArray.map((url, i) => checkUrl(url, i)));

    return {
      data: checkedUrls,
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
