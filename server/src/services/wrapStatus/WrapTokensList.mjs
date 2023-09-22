import Base from '../Base';
import { WrapStatusFioWrapTokensLogs } from '../../models';
import { normalizeWrapData, filterWrapItemsByDateRange } from '../../utils/wrap.mjs';

export default class WrapTokensList extends Base {
  static get validationRules() {
    return {
      offset: 'string',
      limit: 'string',
      filters: [
        {
          nested_object: {
            createdAt: 'string',
            dateRange: [
              {
                nested_object: {
                  startDate: 'integer',
                  endDate: 'integer',
                },
              },
            ],
          },
        },
      ],
    };
  }

  async execute({ limit, offset = 0, filters }) {
    const list = await WrapStatusFioWrapTokensLogs.listWithConfirmation(limit, offset);
    const count = await WrapStatusFioWrapTokensLogs.actionsCount();

    const { createdAt, dateRange } = filters || {};

    let wrapList = [];

    const normalizedWrapList = list.map(listItem => normalizeWrapData(listItem));

    if (createdAt || (dateRange && dateRange.startDate && dateRange.endDate)) {
      wrapList = filterWrapItemsByDateRange({
        createdAt,
        dateRange,
        normalizedWrapItemsData: normalizedWrapList,
      });
    } else {
      wrapList = normalizedWrapList;
    }

    return {
      data: {
        list: wrapList,
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
