import crypto from 'crypto';

import mailchimpMarketing from '@mailchimp/mailchimp_marketing';

import logger from '../logger';
import config from '../config';

const STATUSES = {
  subscribed: 'subscribed',
  unsubscribed: 'unsubscribed',
};

class MarketingMailchimp {
  constructor() {
    mailchimpMarketing.setConfig({
      apiKey: config.mail.mailchimpMarketing,
      server: config.mail.mailchimpServerPrefix,
    });
  }

  hashEmail(email) {
    return crypto
      .createHash('md5')
      .update(email.toLowerCase())
      .digest('hex');
  }

  async isSubscribed(email) {
    const subscriberHash = this.hashEmail(email);

    try {
      const data = await mailchimpMarketing.lists.getListMember(
        config.mail.mailchimpListId,
        subscriberHash,
        {},
      );
      return data.status === STATUSES.subscribed;
    } catch (err) {
      return false;
    }
  }

  async sendEvent(email, event) {
    const subscriberHash = this.hashEmail(email);

    try {
      await mailchimpMarketing.lists.createListMemberEvent(
        config.mail.mailchimpListId,
        subscriberHash,
        {
          name: event,
          properties: '',
          is_syncing: false,
          occurred_at: '',
        },
      );
    } catch (err) {
      logger.error(err.message);
    }
  }

  async addEmailToPromoList(email) {
    const subscriberHash = this.hashEmail(email);

    const body = {
      email_address: email,
      status_if_new: 'subscribed',
      email_type: 'html',
      status: 'subscribed',
      timestamp_signup: new Date().toISOString().split('.')[0] + '+00:00', // Time format should be ISO 8601. But mailchimp doesn't recognize timestamp with Z in the end
    };

    try {
      return await mailchimpMarketing.lists.setListMember(
        config.mail.mailchimpListId,
        subscriberHash,
        body,
      );
    } catch (err) {
      logger.error(err.message);
    }
  }
}

export default new MarketingMailchimp();
