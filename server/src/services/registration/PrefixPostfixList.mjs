import Base from '../Base';
import { SearchTerm } from '../../models';

export default class DefaultList extends Base {
  async execute() {
    const searchPrefixes = await SearchTerm.getPrefixes();
    const searchPostfixes = await SearchTerm.getPostfixes();

    return {
      data: {
        searchPrefixes,
        searchPostfixes,
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
