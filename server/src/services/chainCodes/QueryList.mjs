import Base from '../Base.mjs';

import { ChainCode } from '../../models';

export class ChainCodesQueryList extends Base {
  static get validationRules() {
    return {
      chainCode: ['trim', 'to_lc'],
    };
  }
  async execute({ chainCode }) {
    if (!chainCode) return { data: null };

    const chainCodes = await ChainCode.list(chainCode);

    return {
      data: chainCodes.map(chainCodeItem =>
        ChainCode.format(chainCodeItem.get({ plain: true })),
      ),
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['*'];
  }
}
