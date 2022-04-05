import mailchimpProvider from '@mailchimp/mailchimp_transactional';

import EmailTemplate, { templates } from './../emails/emailTemplate';
import config from './../config';
import logger from './../logger';
import {
  EXPIRING_DOMAINS_EMAIL_SUBJECTS,
  EXPIRING_DOMAINS_EMAIL_TITLE,
} from '../config/constants';

const EMAIL_SENT_STATUS = 'sent';

class EmailSender {
  constructor() {
    this.mailClient = mailchimpProvider(config.mail.mailchimpKey);
  }

  async send(type, email, data) {
    const sendData = {
      ...data,
      mainUrl: config.mainUrl,
      supportLink: config.supportLink,
    };
    const template = await this.getTemplate(type, sendData);
    const emailTo = process.env.TEST_RECIEVER_EMAIL
      ? process.env.TEST_RECIEVER_EMAIL
      : email;

    const mailOptions = {
      message: {
        subject: template.subject,
        html: template.body,
        from_email: config.mail.from,
        from_name: config.mail.fromName,
        to: [
          {
            email: emailTo,
          },
        ],
        images: template.images,
        track_opens: false,
        track_clicks: false,
        auto_text: true,
        view_content_link: false,
      },
    };

    try {
      const response = await this.sendMail(mailOptions);

      if (response[0] == null) throw new Error('Email send error');
      if (response[0].status !== EMAIL_SENT_STATUS)
        throw new Error(JSON.stringify(response[0]));

      return response[0];
    } catch (err) {
      logger.error(err.message);
      try {
        logger.error(err.toJSON());
      } catch (e) {
        //
      }

      return false;
    }
  }

  sendMail(mailOptions) {
    return this.mailClient.messages.send(mailOptions);
  }

  async getTemplate(templateName, sendData) {
    switch (templateName) {
      case templates.createAccount:
        return {
          subject: 'Welcome to FIO Dashboard.',
          body: EmailTemplate.get(templateName, sendData),
          images: EmailTemplate.getInlineImages(templateName),
        };
      case templates.confirmEmail: {
        let link = `${sendData.mainUrl}confirm-email/${sendData.hash}`;

        if (sendData.refCode) {
          link = `${link}?refCode=${sendData.refCode}`;
        }
        delete sendData.refCode;

        if (sendData.updateEmail) {
          link = `${sendData.mainUrl}confirm-updated-email/${sendData.hash}`;
          delete sendData.updateEmail;
        }

        return {
          subject: 'FIO Dashboard - please confirm your email',
          body: EmailTemplate.get(templateName, {
            link,
            ...sendData,
          }),
          images: EmailTemplate.getInlineImages(templateName),
        };
      }
      case templates.passRecovery:
        return {
          subject: 'FIO Dashboard recovery link',
          body: EmailTemplate.get(templateName, {
            link: `${sendData.mainUrl}account-recovery?username=${sendData.username}&token=${sendData.token}`,
            ...sendData,
          }),
          images: EmailTemplate.getInlineImages(templateName),
        };

      /**
       *
       * @param date example 24/03/2022 @ 5:46 pm
       * @param requestingFioCryptoHandle example 'test@test'
       * @param requestSentTo example 'test@test'
       * @param fioRequestId example '24456'
       * @param wallet example FIO82i9X4UpBC8yKRs1F59cbZomFEnryYipHNZXq921EppJheZzK6
       */
      case templates.approveFioRequest:
        return {
          subject: 'Your FIO request has been approved',
          body: EmailTemplate.get(templateName, {
            link: `${sendData.mainUrl}fio-wallet/${sendData.wallet}/fio-request/${sendData.fioRequestId}`,
            ...sendData,
          }),
          images: EmailTemplate.getInlineImages(templateName),
        };

      /**
       *
       * @param date example 24/03/2022 @ 5:46 pm
       * @param requestingFioCryptoHandle example 'test@test'
       * @param requestSentTo example 'test@test'
       * @param fioRequestId example '24456'
       * @param wallet example FIO82i9X4UpBC8yKRs1F59cbZomFEnryYipHNZXq921EppJheZzK6
       */
      case templates.rejectFioRequest:
        return {
          subject: 'Your FIO request has been rejected',
          body: EmailTemplate.get(templateName, {
            link: `${sendData.mainUrl}fio-wallet/${sendData.wallet}/fio-request/${sendData.fioRequestId}`,
            ...sendData,
          }),
          images: EmailTemplate.getInlineImages(templateName),
        };

      /**
       *
       * @param date example 24/03/2022 @ 5:46 pm
       * @param requestor example 'test@test'
       * @param to example 'test@test'
       * @param fioRequestId example '24456'
       * @param wallet example FIO82i9X4UpBC8yKRs1F59cbZomFEnryYipHNZXq921EppJheZzK6
       */
      case templates.newFioRequest:
        return {
          subject: 'You have received a new FIO request',
          body: EmailTemplate.get(templateName, {
            link: `${sendData.mainUrl}fio-wallet/${sendData.wallet}/fio-request/${sendData.fioRequestId}`,
            ...sendData,
          }),
          images: EmailTemplate.getInlineImages(templateName),
        };

      /**
       *
       * @param date example 24/03/2022 @ 5:46 pm
       * @param fioBalanceChange example +120 FIO ($120.00 USDC)
       * @param newFioBalance example +220 FIO ($220.00 USDC)
       * @param wallet example FIO82i9X4UpBC8yKRs1F59cbZomFEnryYipHNZXq921EppJheZzK6
       */
      case templates.balanceChange:
        return {
          subject: 'You FIO balance has changed',
          body: EmailTemplate.get(templateName, {
            link: `${sendData.mainUrl}fio-wallet/${sendData.wallet}`,
            ...sendData,
          }),
          images: EmailTemplate.getInlineImages(templateName),
        };

      /**
       *
       * @param domains[]
       * @param domains.name example 'tester@test'
       * @param domains.date example 24/03/2022 @ 5:46 pm
       * @param expiringStatus example EXPIRED_90
       */
      case templates.expiringDomains:
        return {
          subject: EXPIRING_DOMAINS_EMAIL_SUBJECTS[sendData.expiringStatus],
          body: EmailTemplate.get(templateName, {
            link: `${
              sendData.domains.length === 1
                ? `${sendData.mainUrl}fio-domain-renew/${sendData.domains[0].name}`
                : `${sendData.mainUrl}fio-domains`
            }`,
            title: EXPIRING_DOMAINS_EMAIL_SUBJECTS[sendData.expiringStatus],
            mainTitle: EXPIRING_DOMAINS_EMAIL_TITLE[sendData.expiringStatus],
            ...sendData,
          }),
          images: EmailTemplate.getInlineImages(templateName),
        };

      /**
       *
       * @param fioCryptoHandles[]
       * @param fioCryptoHandles.name example 'tester@test'
       * @param fioCryptoHandles.bundles example 24
       */
      case templates.lowBundleCount:
        return {
          subject: 'Your remaining FIO bundled transactions is low',
          body: EmailTemplate.get(templateName, {
            link: `${
              sendData.fioCryptoHandles.length === 1
                ? `${sendData.mainUrl}add-bundles/${sendData.fioCryptoHandles[0].name}`
                : `${sendData.mainUrl}fio-crypto-handles`
            }`,
            ...sendData,
          }),
          images: EmailTemplate.getInlineImages(templateName),
        };
    }
    throw new Error(`There is no email template with such name - ${templateName}`);
  }
}

export default new EmailSender();
