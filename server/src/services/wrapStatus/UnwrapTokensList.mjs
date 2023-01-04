import Base from '../Base';
import { WrapStatusEthUnwrapLogs } from '../../models';

export default class UnwrapTokensList extends Base {
  static get validationRules() {
    return {
      offset: 'string',
      limit: 'string',
    };
  }

  async execute({ limit = 25, offset = 0 }) {
    const list = await WrapStatusEthUnwrapLogs.listWithConfirmation(limit, offset);
    const count = await WrapStatusEthUnwrapLogs.actionsCount();

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
