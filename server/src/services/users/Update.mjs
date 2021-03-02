import Base from '../Base';
import X from '../Exception';

import { User } from '../../models';

export default class UsersUpdate extends Base {
  static get validationRules() {
    return {
      data: [
        'required',
        {
          nested_object: {
            username: { min_length: 2 },
          },
        },
      ],
    };
  }

  async execute({ data }) {
    const user = await User.findActive(this.context.id);

    if (!user) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
        },
      });
    }

    await user.update(data);

    return {
      data: user.json(),
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['data.email', 'data.location'];
  }
}
