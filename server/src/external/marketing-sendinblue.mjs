import SibApiV3Sdk from 'sib-api-v3-sdk';
import superagent from 'superagent';

import config from '../config';
import logger from '../logger';

class MarketingSendInBlue {
  getSendInBlueClient() {
    if (!this.sendInBlueClient) {
      const defaultClient = SibApiV3Sdk.ApiClient.instance;
      const apiKey = defaultClient.authentications['api-key'];
      apiKey.apiKey = config.mail.sendinblueApiKey;

      this.sendInBlueClient = new SibApiV3Sdk.ContactsApi();
    }
    return this.sendInBlueClient;
  }

  async getContactInfo(email) {
    const sendInBlueClient = this.getSendInBlueClient();

    try {
      return await sendInBlueClient.getContactInfo(email);
    } catch (err) {
      logger.error(err.message);
    }
  }

  async isSubscribed(email) {
    try {
      const constactInfo = await this.getContactInfo(email);
      if (
        constactInfo.listIds.length &&
        constactInfo.listIds.includes(config.mail.sendinbuleListId)
      ) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      logger.error(err.message);
      return false;
    }
  }

  async sendEvent(email, event) {
    try {
      await superagent
        .post(`${config.mail.sendinblueEventUrl}/trackEvent`)
        .set('ma-key', config.mail.sendinblueEventTrackerId)
        .send({ email, event, properties: {} });
    } catch (err) {
      logger.error(err.message);
    }
  }

  async addEmailToPromoList(email) {
    const sendInBlueClient = this.getSendInBlueClient();

    const createContact = new SibApiV3Sdk.CreateContact();

    createContact.email = email;
    createContact.listIds = [Number(config.mail.sendinbuleListId)];
    createContact.updateEnabled = true;

    try {
      return await sendInBlueClient.createContact(createContact);
    } catch (err) {
      logger.error(err.message);
    }
  }
}

export default new MarketingSendInBlue();
