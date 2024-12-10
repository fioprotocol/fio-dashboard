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

  static get skipLog() {
    // Do not spam with success logs. Show only if fails
    return result => result && result.data && result.data.success;
  }
}
