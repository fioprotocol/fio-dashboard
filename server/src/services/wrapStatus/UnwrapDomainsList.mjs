import Base from '../Base';
import { WrapStatusPolygonUnwrapLogs } from '../../models';
import { normalizeUnwrapData, filterWrapItemsByDateRange } from '../../utils/wrap.mjs';
import { DEFAULT_LIMIT, DEFAULT_OFFSET, MAX_LIMIT } from '../../constants/general.mjs';

export default class UnwrapDomainsList extends Base {
  static get validationRules() {
    return {
      offset: ['integer', { min_number: 0 }],
      limit: ['integer', { min_number: 0 }, { max_number: MAX_LIMIT }],
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

  async execute({ limit = DEFAULT_LIMIT, offset = DEFAULT_OFFSET, filters }) {
    const list = await WrapStatusPolygonUnwrapLogs.listWithConfirmation(limit, offset);
    const count = await WrapStatusPolygonUnwrapLogs.actionsCount();

    const { createdAt, dateRange } = filters || {};

    let unwrapList;

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
