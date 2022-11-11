import Base from '../Base';

export default class GeneralHealthCheck extends Base {
  async execute() {
    return { data: { success: true } };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
