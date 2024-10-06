import Base from '../Base';
import { WrapStatusFioBurnedDomainsLogs } from '../../models';
import { filterWrapItemsByDateRange, normalizeBurnData } from '../../utils/wrap.mjs';
import { DEFAULT_LIMIT, DEFAULT_OFFSET, MAX_LIMIT } from '../../constants/general.mjs';

export default class BurnedDomainsList extends Base {
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
    const list = await WrapStatusFioBurnedDomainsLogs.listWithConfirmation(limit, offset);
    const count = await WrapStatusFioBurnedDomainsLogs.actionsCount();

    const { createdAt, dateRange } = filters || {};

    let burnedDomainsList;

    const normalizedBurnedDomainsList = list.map(listItem => normalizeBurnData(listItem));

    if (createdAt || (dateRange && dateRange.startDate && dateRange.endDate)) {
      burnedDomainsList = filterWrapItemsByDateRange({
        createdAt,
        dateRange,
        normalizedWrapItemsData: normalizedBurnedDomainsList,
      });
    } else {
      burnedDomainsList = normalizedBurnedDomainsList;
    }

    return {
      data: {
        list: burnedDomainsList,
        maxCount: filters ? burnedDomainsList.length : count,
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
