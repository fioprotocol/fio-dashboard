import Base from '../Base';
import { Domain } from '../../models';

export default class AvailableDomainsList extends Base {
  async execute() {
    const availableDomains = await Domain.getAvailableDomains();

    return {
      data: availableDomains,
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
