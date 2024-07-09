import Base from '../Base';
import { WrapStatusFioBurnedDomainsLogs } from '../../models';
import { normalizeWrapData, filterWrapItemsByDateRange } from '../../utils/wrap.mjs';

export default class BurnedDomainsList extends Base {
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
    const list = await WrapStatusFioBurnedDomainsLogs.listWithConfirmation(limit, offset);
    const count = await WrapStatusFioBurnedDomainsLogs.actionsCount();

    const { createdAt, dateRange } = filters || {};

    let burnedDomainsList = [];

    const normalizedBurnedDomainsList = list.map(listItem => normalizeWrapData(listItem));

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
