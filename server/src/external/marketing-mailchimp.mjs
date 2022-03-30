import crypto from 'crypto';

import mailchimpMarketing from '@mailchimp/mailchimp_marketing';

import logger from '../logger';
import config from '../config';

class MarketingMailchimp {
  constructor() {
    mailchimpMarketing.setConfig({
      apiKey: config.mail.mailchimpMarketing,
      server: config.mail.mailchimpServerPrefix,
    });
  }

  async addEmailToPromoList(email) {
    const subscriberHash = crypto
      .createHash('md5')
      .update(email.toLowerCase())
      .digest('hex');

    const body = {
      email_address: email,
      status_if_new: 'subscribed',
      email_type: 'html',
      status: 'subscribed',
      timestamp_signup: new Date().toISOString().replace('Z', '+00:00'), // mailchimp doesn't recognize timestamp with Z in the end
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
