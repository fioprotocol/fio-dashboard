import Base from '../Base';
import { Domain, Username } from '../../models';

export default class DefaultList extends Base {
  async execute() {
    const availableDomains = await Domain.getAvailableDomains();
    const dashboardDomains = await Domain.getDashboardDomains();
    const usernamesOnCustomDomains = await Username.findAll({
      order: [['rank', 'DESC']],
    });

    return {
      data: {
        availableDomains,
        dashboardDomains,
        usernamesOnCustomDomains,
      },
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
