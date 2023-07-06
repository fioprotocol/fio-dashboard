import crypto from 'crypto';

import superagent from 'superagent';

import logger from '../../logger';
import Base from '../Base';
import X from '../Exception';

export default class ImageToHash extends Base {
  static get validationRules() {
    return {
      imageUrl: ['string'],
    };
  }

  async execute({ imageUrl }) {
    try {
      const response = await superagent.get(imageUrl).buffer();

      if (!response.ok) {
        throw new Error('Image request failed.');
      }
      const imageBuffer = Buffer.from(response.body, 'binary');
      const hash = crypto
        .createHash('sha256')
        .update(imageBuffer)
        .digest('hex');

      return {
        data: hash,
      };
    } catch (error) {
      logger.error(`Get hash from image: ${error}`);
      throw new X({
        code: 'SERVER_ERROR',
        fields: {
          imageToHash: 'SERVER_ERROR',
        },
      });
    }
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['*'];
  }
}
