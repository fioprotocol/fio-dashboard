import Base from '../Base';
import X from '../Exception';

import { Action } from '../../models';

import { DAY_MS } from '../../config/constants.js';

export const ACTION_EPX_TIME = DAY_MS * 30; // 1 month

export default class ActionsSubmit extends Base {
  async validate(data) {
    const action = await Action.findOneWhere({ hash: data.hash });

    if (!action) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          hash: 'INVALID',
        },
      });
    }

    if (new Date().getTime() - new Date(action.createdAt).getTime() > ACTION_EPX_TIME) {
      await action.destroy({ force: true });
      throw new X({
        code: 'EXPIRED',
        fields: {
          hash: 'EXPIRED',
        },
      });
    }

    const rulesRegistry = {
      confirmEmailAdmin: {},
    };

    return this.doValidation(data, {
      ...rulesRegistry[action.type],
      hash: ['required'],
    });
  }

  async execute(data) {
    const action = await Action.findOneWhere({ hash: data.hash });

    await action.run(data);
    await action.destroy();

    const { state, ...rest } = action.data;
    return { data: { ...rest, stateData: state } };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
