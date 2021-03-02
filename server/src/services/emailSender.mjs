import nodemailer from 'nodemailer';
import sendmailTransport from 'nodemailer-sendmail-transport';
import smtpTransport from 'nodemailer-smtp-transport';
import stubTransport from 'nodemailer-stub-transport';
import config from './../config';
import logger from './../logger';

class EmailSender {
  constructor() {
    let transport;

    switch (config.mail.transport) {
      case 'SMTP':
        transport = smtpTransport(config.mail.smtp);
        break;

      case 'SENDMAIL':
        transport = sendmailTransport();
        break;
      default:
        throw new Error('transport not fount');
    }

    const { TEST_MODE } = process.env;

    if (TEST_MODE) {
      transport = stubTransport();
    }

    const options = TEST_MODE ? { directory: '/tmp' } : config.mail.transport_options;

    this.transport = nodemailer.createTransport(transport, options);
  }

  async send(type, destinationUser, data) {
    const sendData = {
      ...data,
      mainUrl: config.mainUrl,
    };
    const template = await this.getTemplate(type, sendData);

    const mailOptions = {
      from: config.mail.from,
      to: destinationUser,
      subject: template.subject,
      html: template.body,
    };

    try {
      const response = await this.transportSendMail(mailOptions);

      return response.message;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  transportSendMail(mailOptions) {
    return new Promise((resolve, reject) => {
      this.transport.sendMail(mailOptions, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  async getTemplate(templateName, sendData) {
    switch (templateName) {
      case 'confirmEmail':
        return {
          subject: 'Confirm your email',
          body: `To confirm your email click this link: <a href="${
            sendData.mainUrl
          }/confirmEmail/${sendData.hash}">Confirm email!</a>`,
        };
      case 'resetPassword':
        return {
          subject: 'Reset your password',
          body: `To reset your password click this link: <a href="${
            sendData.mainUrl
          }/reset-password/${sendData.hash}">Reset password!</a>`,
        };
      case 'resetPasswordSuccess':
        return {
          subject: 'Reset password success',
          body: 'Your password changed successfully',
        };
      case 'accountActivated':
        return {
          subject: 'Account successfully activated',
          body: `Your account activated successfully. <a href="${
            sendData.mainUrl
          }">Go to site!</a>`,
        };
    }
    return { subject: 'test', body: 'this is test email' };
  }
}

export default new EmailSender();
