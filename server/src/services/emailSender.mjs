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
          subject: 'Welcome to FIO App.',
          body: EmailTemplate.get(templateName, sendData),
          images: EmailTemplate.getInlineImages(templateName),
        };
      case templates.confirmAdminEmail:
        return {
          subject: 'FIO App - please confirm your email',
          body: EmailTemplate.get(templateName, {
            link: `${sendData.adminUrl}confirm-email?${QUERY_PARAMS_NAMES.HASH}=${sendData.hash}&${QUERY_PARAMS_NAMES.EMAIL}=${sendData.email}`,
            ...sendData,
          }),
          images: EmailTemplate.getInlineImages(templateName),
        };
      case templates.resetAdminPasswordEmail:
        return {
          subject: 'FIO App - password reset',
          body: EmailTemplate.get(templateName, {
            link: `${sendData.adminUrl}reset-password?${QUERY_PARAMS_NAMES.HASH}=${sendData.hash}&${QUERY_PARAMS_NAMES.EMAIL}=${sendData.email}`,
            ...sendData,
          }),
          images: EmailTemplate.getInlineImages(templateName),
        };
      case templates.passRecovery:
        return {
          subject: 'FIO App recovery link',
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
       * @param fioBalanceChange example +$120.00 (120 FIO)
       * @param newFioBalance example +$220.00 (220 FIO)
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
                : `${sendData.mainUrl}fio-handles`
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
       * @param successedOrderItems.priceAmount example '$17.36 (378.97 FIO)'
       * @param successedOrderItems.descriptor example 'FIO Handle Registration'
       *
       * @param successedOrderPaymentInfo {}
       * @param successedOrderPaymentInfo.total example '$17.36 (378.97 FIO)'
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
       * @param failedOrderItems.priceAmount example '$17.36 (378.97 FIO)'
       * @param failedOrderItems.descriptor example 'FIO Handle Registration'
       *
       * @param failedOrderPaymentInfo {}
       * @param failedOrderPaymentInfo.total example '$17.36 (378.97 FIO)'
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
          subject: `FIO App purchase confirmation - ${sendData.orderNumber}`,
          body: EmailTemplate.get(templateName, {
            link: `${sendData.mainUrl}order-details?${QUERY_PARAMS_NAMES.ORDER_NUMBER}=${sendData.orderNumber}`,
            ...sendData,
          }),
          images: EmailTemplate.getInlineImages(templateName),
        };

      case templates.freeLimitReached:
        return {
          subject: `API daily limit reached for ${sendData.refProfileName}`,
          body: `
<p>API daily limit of <b>${sendData.limit}</b> free FIO Handles has been reached for partner profile <b>${sendData.refProfileName}</b>, api key *<i>${sendData.lastApiToken}</i>.</p>`,
          text: `API daily limit of ${sendData.limit} free FIO Handles has been reached for partner profile ${sendData.refProfileName}, api key *${sendData.lastApiToken}.`,
        };

      case templates.deviceApproveRequested:
        return {
          subject: `FIO App Device Approval Request`,
          body: EmailTemplate.get(templates.common, {
            ...sendData,
            headerTitle: `New Sign In Device Request`,
            html: `<p>Hi,</p>

<p>An attempt was made to sign in to your account from a device we did not recognize.</p>

<p>Since you have enabled the New Device Approval security feature on your account, that sign-in must be approved on the device you have previously signed in from.</p>

<p>If you do not have access to that device, you can use the access code provided to you when you enabled New Device Approval security feature. If you do not have the access code you will have to wait 7 days before you will be able to sign in from an unknown device.</p>

<b>If you did not initiate this sign-in attempt, your password may have been compromised and you should change it within the next 7 days to avoid unauthorized access.</b>

<p>To do so, please sign in to your account and take these steps to ensure your account is safe:</p>

<ul>
    <li>Deny the request for access</li>
    <li>Change your password</li>
</ul>
`,
          }),
          images: EmailTemplate.getInlineImages(templates.common),
          text: `Hi,
An attempt was made to sign in to your account from a device we did not recognize.

Since you have enabled the New Device Approval security feature on your account, that sign-in must be approved on the device you have previously signed in from.

If you do not have access to that device, you can use the access code provided to you when you enabled New Device Approval security feature. If you do not have the access code you will have to wait 7 days before you will be able to sign in from an unknown device.

If you did not initiate this sign-in attempt, your password may have been compromised and you should change it within the next 7 days to avoid unauthorized access.

To do so, please sign in to your account and take these steps to ensure your account is safe:
• Deny the request for access
• Change your password
`,
        };

      case templates.deviceSignIn:
        return {
          subject: `FIO App Sign-in Attempt`,
          body: EmailTemplate.get(templates.common, {
            ...sendData,
            headerTitle: `FIO App Sign-in Attempt`,
            html: `<p>Hi,</p>

<p>It looks like someone is trying to sign in to your FIO App account from a device we did not recognize.</p>

<div>
    <p><span>Device:</span> ${sendData.device}</p>
    <p><span>Date and time:</span> ${sendData.date}</p>
    <p><span>Location:</span> ${sendData.location}</p>
    <p><span>Account email:</span> ${sendData.email}</p>
</div>

<p>If this was you, no further action is needed and you may disregard this email.</p>
<p>If this sign-in attempt is unexpected and not you, please do the following:</p>

<ul>
    <li>Sign in to your account and change your password</li>
</ul>
`,
          }),
          images: EmailTemplate.getInlineImages(templates.common),
          text: `Hi,

It looks like someone is trying to sign in to your FIO App account from a device we did not recognize.

Device: ${sendData.device}
Date and time: ${sendData.date}
Location: ${sendData.location}
Account email: ${sendData.email}

If this was you, no further action is needed and you may disregard this email.
If this sign-in attempt is unexpected and not you, please do the following:

• Sign in to your account and change your password
`,
        };
    }

    throw new Error(`There is no email template with such name - ${templateName}`);
  }
}

export default new EmailSender();
