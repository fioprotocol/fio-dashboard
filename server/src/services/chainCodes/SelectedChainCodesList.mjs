import Base from '../Base.mjs';

import { ChainCode } from '../../models';

export class SelectedChainCodesList extends Base {
  static get validationRules() {
    return {
      chainCodes: {
        or: [{ list_of: 'string' }, 'string'],
      },
    };
  }
  async execute({ chainCodes }) {
    if (!chainCodes) return { data: null };

    const selectedChainCodesList = await ChainCode.selectedChainCodesList(
      typeof chainCodes === 'string' ? [chainCodes] : chainCodes,
    );

    return {
      data: selectedChainCodesList.map(chainCodeItem =>
        ChainCode.format(chainCodeItem.get({ plain: true })),
      ),
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
