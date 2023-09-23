import Base from '../Base';
import { WrapStatusPolygonUnwrapLogs } from '../../models';
import { normalizeUnwrapData, filterWrapItemsByDateRange } from '../../utils/wrap.mjs';

export default class UnwrapDomainsList extends Base {
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
    const list = await WrapStatusPolygonUnwrapLogs.listWithConfirmation(limit, offset);
    const count = await WrapStatusPolygonUnwrapLogs.actionsCount();

    const { createdAt, dateRange } = filters || {};

    let unwrapList = [];

    const normalizedUnwrapList = list.map(listItem => normalizeUnwrapData(listItem));

    if (createdAt || (dateRange && dateRange.startDate && dateRange.endDate)) {
      unwrapList = filterWrapItemsByDateRange({
        createdAt,
        dateRange,
        normalizedWrapItemsData: normalizedUnwrapList,
      });
    } else {
      unwrapList = normalizedUnwrapList;
    }

    return {
      data: {
        list: unwrapList,
        maxCount: filters ? unwrapList.length : count,
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
