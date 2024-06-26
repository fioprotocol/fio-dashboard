import Base from '../Base';

import { getExistUsersByPublicKeyOrCreateNew } from '../../utils/user.mjs';

export default class CreateUserWithoutRegistrtion extends Base {
  static get validationRules() {
    return {
      data: [
        'required',
        {
          nested_object: {
            publicKey: ['string', 'required'],
            refCode: ['string', 'required'],
            timeZone: ['string'],
          },
        },
      ],
    };
  }

  async execute({ data: { publicKey, refCode, timeZone } }) {
    const users = await getExistUsersByPublicKeyOrCreateNew(publicKey, refCode, timeZone);

    return { data: users };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['data'];
  }
}
