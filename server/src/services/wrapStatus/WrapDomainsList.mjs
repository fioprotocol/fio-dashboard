import Base from '../Base';
import { WrapStatusFioWrapNftsLogs } from '../../models';

export default class WrapDomainsList extends Base {
  static get validationRules() {
    return {
      offset: 'string',
      limit: 'string',
    };
  }

  async execute({ limit = 25, offset = 0 }) {
    const list = await WrapStatusFioWrapNftsLogs.listWithConfirmation(limit, offset);
    const count = await WrapStatusFioWrapNftsLogs.actionsCount();

    return {
      data: {
        list: list || [],
        maxCount: count,
      },
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['data'];
  }
}
