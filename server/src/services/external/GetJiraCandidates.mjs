import { getJiraCandidates } from '../../external/jira.mjs';

import logger from '../../logger';
import Base from '../Base';
import X from '../Exception';

export default class GetJiraCandidates extends Base {
  static get validationRules() {
    return {
      publicKey: ['string'],
    };
  }

  async execute({ publicKey }) {
    try {
      const candidates = await getJiraCandidates({ publicKey });
      return { data: candidates };
    } catch (error) {
      logger.error('Get Jira candidates service error', error);
      throw new X({ code: 'SERVER_ERROR', fields: { candidates: 'SERVER_ERROR' } });
    }
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['*'];
  }
}
