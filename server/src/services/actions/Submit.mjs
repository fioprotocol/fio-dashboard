import Base from '../Base';
import X from '../Exception';

import { Action } from '../../models';

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

    const rulesRegistry = {
      resetPassword: {
        password: 'required',
        confirmPassword: ['required', { equal_to_field: ['password'] }],
      },

      confirmEmail: {},
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

    return {};
  }

  static get paramsSecret() {
    return ['password', 'confirmPassword'];
  }

  static get resultSecret() {
    return [];
  }
}
