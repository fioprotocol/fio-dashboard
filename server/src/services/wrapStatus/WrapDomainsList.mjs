import Base from '../Base';
import { WrapStatusFioWrapNftsLogs } from '../../models';
import { normalizeWrapData, filterWrapItemsByDateRange } from '../../utils/wrap.mjs';
import { DEFAULT_LIMIT, DEFAULT_OFFSET, MAX_LIMIT } from '../../constants/general.mjs';

export default class WrapDomainsList extends Base {
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
    const list = await WrapStatusFioWrapNftsLogs.listWithConfirmation(limit, offset);
    const count = await WrapStatusFioWrapNftsLogs.actionsCount();

    const { createdAt, dateRange } = filters || {};

    let wrapList;

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
