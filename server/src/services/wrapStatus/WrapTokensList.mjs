import Base from '../Base';
import { WrapStatusFioWrapTokensLogs } from '../../models';

export default class WrapTokensList extends Base {
  static get validationRules() {
    return {
      offset: 'string',
      limit: 'string',
    };
  }

  async execute({ limit = 25, offset = 0 }) {
    const list = await WrapStatusFioWrapTokensLogs.listWithConfirmation(limit, offset);
    const count = await WrapStatusFioWrapTokensLogs.actionsCount();

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
