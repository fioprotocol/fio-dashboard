import nodemailer from 'nodemailer';
import sendmailTransport from 'nodemailer-sendmail-transport';
import smtpTransport from 'nodemailer-smtp-transport';
import SendinblueTransport from 'nodemailer-sendinblue-transport';

import EmailTemplate, { templates } from './../emails/emailTemplate';
import config from './../config';
import logger from './../logger';
import {
  EXPIRING_DOMAINS_EMAIL_SUBJECTS,
  EXPIRING_DOMAINS_EMAIL_TITLE,
  QUERY_PARAMS_NAMES,
} from '../config/constants';

class EmailSender {
  constructor() {
    let transport;

    switch (config.mail.transport) {
      case 'SES':
        transport = config.mail.transport_options;
        break;

      case 'SENDINBLUE':
        transport = new SendinblueTransport({
          apiKey: config.mail.sendinblueKey,
        });
        break;

      case 'SMTP':
        transport = smtpTransport(config.mail.smtp);
        break;

      case 'SENDMAIL':
        transport = sendmailTransport();
        break;

      default:
        throw new Error('transport not fount');
    }

    const options = config.mail.transport_options;

    this.transport = nodemailer.createTransport(transport, options);
  }

  async send(type, email, data) {
    const sendData = {
      ...data,
      mainUrl: config.mainUrl,
      adminUrl: config.adminUrl,
      supportLink: config.supportLink,
      logoSrc: config.mainUrl + 'fio-logo-white-text.png',
      email,
    };
    const template = await this.getTemplate(type, sendData);
    const emailTo = process.env.TEST_RECIEVER_EMAIL
      ? process.env.TEST_RECIEVER_EMAIL
      : email;

    const mailOptions = {
      subject: template.subject,
      html: template.body,
      from: config.mail.from,
      to: emailTo,
    };

    try {
      return await this.sendMail(mailOptions);
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
    return new Promise((resolve, reject) => {
      this.transport.sendMail(mailOptions, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }

  async getTemplate(templateName, sendData) {
    switch (templateName) {
      case templates.createAccount:
        return {
          subject: 'Welcome to FIO Dashboard.',
          body: EmailTemplate.get(templateName, sendData),
          images: EmailTemplate.getInlineImages(templateName),
        };
      case templates.confirmAdminEmail:
        return {
          subject: 'FIO Dashboard - please confirm your email',
          body: EmailTemplate.get(templateName, {
            link: `${sendData.adminUrl}confirm-email?${QUERY_PARAMS_NAMES.HASH}=${sendData.hash}&${QUERY_PARAMS_NAMES.EMAIL}=${sendData.email}`,
            ...sendData,
          }),
          images: EmailTemplate.getInlineImages(templateName),
        };
      case templates.resetAdminPasswordEmail:
        return {
          subject: 'FIO Dashboard - password reset',
          body: EmailTemplate.get(templateName, {
            link: `${sendData.adminUrl}reset-password?${QUERY_PARAMS_NAMES.HASH}=${sendData.hash}&${QUERY_PARAMS_NAMES.EMAIL}=${sendData.email}`,
            ...sendData,
          }),
          images: EmailTemplate.getInlineImages(templateName),
        };
      case templates.passRecovery:
        return {
          subject: 'FIO Dashboard recovery link',
          body: EmailTemplate.get(templateName, {
            link: `${sendData.mainUrl}account-recovery?${QUERY_PARAMS_NAMES.USERNAME}=${sendData.username}&${QUERY_PARAMS_NAMES.TOKEN}=${sendData.token}`,
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
            link: `${sendData.mainUrl}fio-request?${QUERY_PARAMS_NAMES.PUBLIC_KEY}=${sendData.wallet}&${QUERY_PARAMS_NAMES.FIO_REQUEST_ID}=${sendData.fioRequestId}`,
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
            link: `${sendData.mainUrl}fio-request?${QUERY_PARAMS_NAMES.PUBLIC_KEY}=${sendData.wallet}&${QUERY_PARAMS_NAMES.FIO_REQUEST_ID}=${sendData.fioRequestId}`,
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
            link: `${sendData.mainUrl}fio-request?${QUERY_PARAMS_NAMES.PUBLIC_KEY}=${sendData.wallet}&${QUERY_PARAMS_NAMES.FIO_REQUEST_ID}=${sendData.fioRequestId}`,
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
          subject: 'Your FIO balance has changed',
          body: EmailTemplate.get(templateName, {
            link: `${sendData.mainUrl}fio-wallet?${QUERY_PARAMS_NAMES.PUBLIC_KEY}=${sendData.wallet}`,
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
                ? `${sendData.mainUrl}fio-domain-renew?${QUERY_PARAMS_NAMES.NAME}=${sendData.domains[0].name}`
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
                ? `${sendData.mainUrl}add-bundles?${QUERY_PARAMS_NAMES.NAME}=${sendData.fioCryptoHandles[0].name}`
                : `${sendData.mainUrl}fio-crypto-handles`
            }`,
            ...sendData,
          }),
          images: EmailTemplate.getInlineImages(templateName),
        };

      case templates.fallbackFundsEmail:
        return {
          subject: 'Reg Site insufficient funds',
          body: `
<p>Registration site got insufficient funds error when registering <b>${
            sendData.fioName
          }${
            sendData.refProfileName
              ? '</b> on profile <b>' + sendData.refProfileName
              : '</b> on <b> FIO'
          }</b> using account <i>${sendData.authorization.actor}</i> and permission <i>${
            sendData.authorization.permission
          }</i>.</p>
<p>You will receive this email once every 24 hrs or until issue is resolved.</p>`,
          text: `Registration site got insufficient funds error when registering ${
            sendData.fioName
          } on ${
            sendData.refProfileName ? 'profile ' + sendData.refProfileName : 'FIO'
          } using account ${sendData.authorization.actor} and permission ${
            sendData.authorization.permission
          }. You will receive this email once every 24 hrs or until issue is resolved.`,
        };

      case templates.emailSenderErrorEmail:
        return {
          subject: 'Email Sender Error',
          body: `
<p>Something went wrong while trying to send the email</p>
<p>You will receive this email once every 24 hrs or until issue is resolved.</p>`,
          text: `Something went wrong while trying to send the email. You will receive this email once every 24 hrs or until issue is resolved.`,
        };

      /**
       *
       * @param orderNumber exmaple '0LP9XM'
       *
       * @param successedOrderItems[]
       * @param successedOrderItems.address example 'tester'
       * @param successedOrderItems.domain example 'testdomain'
       * @param successedOrderItems.hasCustomDomain example 'true'
       * @param successedOrderItems.priceAmount example '378.97 FIO (17.36 USDC)' for FIO and '17.36 USDC' for credit card
       * @param successedOrderItems.descriptor example 'FIO Crypto Handle Registration'
       *
       * @param successedOrderPaymentInfo {}
       * @param successedOrderPaymentInfo.total example '378.97 FIO (17.36 USDC)' for FIO and '17.36 USDC' for credit card
       * @param successedOrderPaymentInfo.paidWith example 'My FIO Wallet' or 'visa ending in 7676'
       * @param successedOrderPaymentInfo.paidWithTitle example 'Paid With' for paid orders and 'Assigned To' for free orders
       * @param successedOrderPaymentInfo.orderNumber example 'ABC123',
       * @param successedOrderPaymentInfo.txIds[] example ['b33d97fe0a0f88c8e2d2bd9783af1bd9b369d4a99105a4b3f74abe3922049003',
      '0f756ad486387411d72aabbdd3b855e30b4d3d18626b13546a9c3d0573cfbac1']
       * @param successedOrderPaymentInfo.txId example 'b33d97fe0a0f88c8e2d2bd9783af1bd9b369d4a99105a4b3f74abe3922049003' or 'pi_3Lah9zH5nAPUdDeK19TBesUO'
       *
       * @param failedOrderItems[]
       * @param failedOrderItems.address example 'tester'
       * @param failedOrderItems.domain example 'testdomain'
       * @param failedOrderItems.hasCustomDomain example 'true'
       * @param failedOrderItems.priceAmount example '378.97 FIO (17.36 USDC)' for FIO and '17.36 USDC' for credit card
       * @param failedOrderItems.descriptor example 'FIO Crypto Handle Registration'
       *
       * @param failedOrderPaymentInfo {}
       * @param failedOrderPaymentInfo.total example '378.97 FIO (17.36 USDC)' for FIO and '17.36 USDC' for credit card
       * @param failedOrderPaymentInfo.paidWith example 'My FIO Wallet' or 'visa ending in 7676'
       * @param failedOrderPaymentInfo.paidWithTitle example 'Paid With' for paid orders and 'Assigned To' for free orders
       * @param failedOrderPaymentInfo.orderNumber example 'ABC123',
       * @param failedOrderPaymentInfo.txIds[] example ['b33d97fe0a0f88c8e2d2bd9783af1bd9b369d4a99105a4b3f74abe3922049003',
      '0f756ad486387411d72aabbdd3b855e30b4d3d18626b13546a9c3d0573cfbac1']
       * @param failedOrderPaymentInfo.txId example 'b33d97fe0a0f88c8e2d2bd9783af1bd9b369d4a99105a4b3f74abe3922049003' or 'pi_3Lah9zH5nAPUdDeK19TBesUO'
       *
       * @param error {}
       * @param error.title string
       * @param error.message string
       */

      case templates.purchaseConfirmation:
        return {
          subject: `FIO dashboard purchase confirmation - ${sendData.orderNumber}`,
          body: EmailTemplate.get(templateName, {
            link: `${sendData.mainUrl}order-details?${QUERY_PARAMS_NAMES.ORDER_NUMBER}=${sendData.orderNumber}`,
            ...sendData,
          }),
          images: EmailTemplate.getInlineImages(templateName),
        };
    }

    throw new Error(`There is no email template with such name - ${templateName}`);
  }
}

export default new EmailSender();
