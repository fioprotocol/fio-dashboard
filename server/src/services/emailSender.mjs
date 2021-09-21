import mailchimpProvider from '@mailchimp/mailchimp_transactional';
import EmailTemplate, { templates } from './../emails/emailTemplate';
import config from './../config';
import logger from './../logger';

class EmailSender {
  constructor() {
    this.mailClient = mailchimpProvider(config.mail.mailchimpKey);
  }

  async send(type, email, data) {
    const sendData = {
      ...data,
      mainUrl: config.mainUrl,
    };
    const template = await this.getTemplate(type, sendData);

    const mailOptions = {
      message: {
        subject: template.subject,
        html: template.body,
        from_email: config.mail.from,
        from_name: config.mail.fromName,
        to: [
          {
            email,
          },
        ],
        track_opens: false,
        track_clicks: false,
        auto_text: true,
        view_content_link: false,
      },
    };

    try {
      const response = await this.sendMail(mailOptions);

      return response[0];
    } catch (err) {
      logger.error(err.message);
      logger.error(err.toJSON());
    }
  }

  sendMail(mailOptions) {
    return this.mailClient.messages.send(mailOptions);
  }

  async getTemplate(templateName, sendData) {
    switch (templateName) {
      case 'createAccount':
        return {
          subject: 'Welcome to FIO Dashboard.',
          body: EmailTemplate.get(templates.createAccount, {}),
        };
      case 'confirmEmail':
        return {
          subject: 'FIO Dashboard - please confirm your email',
          body: `Please click the link below to confirm your email. <a href="${sendData.mainUrl}confirmEmail/${sendData.hash}">${sendData.mainUrl}confirmEmail/${sendData.hash}</a> FIO Dashboard Team.`,
        };
      case 'resetPassword':
        return {
          subject: 'Reset your password',
          body: `To reset your password click this link: <a href="${sendData.mainUrl}reset-password/${sendData.hash}">Reset password!</a>`,
        };
      case 'resetPasswordSuccess':
        return {
          subject: 'Reset password success',
          body: 'Your password changed successfully',
        };
      case 'accountActivated':
        return {
          subject: 'Account successfully activated',
          body: `Your account activated successfully. <a href="${sendData.mainUrl}">Go to site!</a>`,
        };
    }
    return { subject: 'test', body: 'this is test email' };
  }
}

export default new EmailSender();
