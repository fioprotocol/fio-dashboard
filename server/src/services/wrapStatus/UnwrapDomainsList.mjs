import Base from '../Base';
import { WrapStatusPolygonUnwrapLogs } from '../../models';

export default class UnwrapDomainsList extends Base {
  static get validationRules() {
    return {
      offset: 'string',
      limit: 'string',
    };
  }

  async execute({ limit = 25, offset = 0 }) {
    const list = await WrapStatusPolygonUnwrapLogs.listWithConfirmation(limit, offset);
    const count = await WrapStatusPolygonUnwrapLogs.actionsCount();

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
