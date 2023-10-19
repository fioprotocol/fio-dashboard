import crypto from 'crypto';

import Base from '../Base';

export default class GetEdgeContext extends Base {
  async execute() {
    const edgeApiKey = process.env.EDGE_LOGIN_API_KEY;
    const edgeApiId = process.env.EDGE_LOGIN_API_ID;

    const secretKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const edgeApiKeyCipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
    const edgeApiIdCipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);

    let encryptedEdgeApiKey = edgeApiKeyCipher.update(edgeApiKey, 'utf8', 'hex');
    encryptedEdgeApiKey += edgeApiKeyCipher.final('hex');

    let encryptedEdgeApiId = edgeApiIdCipher.update(edgeApiId, 'utf8', 'hex');
    encryptedEdgeApiId += edgeApiIdCipher.final('hex');

    return {
      data: {
        edgeAK: encryptedEdgeApiKey,
        edgeAI: encryptedEdgeApiId,
        buffer: secretKey,
        iv,
      },
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['*'];
  }
}
