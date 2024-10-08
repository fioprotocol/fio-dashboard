import * as uuid from 'uuid';

import { generate, verify } from './authToken';

import Base from '../Base';

import { DAY_MS } from '../../config/constants.js';
import { AUTH_TYPE } from '../../tools.mjs';

const EXPIRATION_TIME = DAY_MS; // 1 day

export default class AuthGuestAuthenticate extends Base {
  static get validationRules() {
    return {
      token: ['token'],
    };
  }

  async execute({ token }) {
    let jwt;

    if (token) {
      try {
        await verify(token);
        jwt = token.replace('Bearer ', '');
      } catch (e) {
        //
      }
    }

    if (!jwt) {
      jwt = generate(
        { type: AUTH_TYPE.GUEST, id: uuid.v4() },
        new Date(EXPIRATION_TIME + Date.now()),
      );
    }

    return {
      data: { jwt },
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['data.jwt'];
  }
}
