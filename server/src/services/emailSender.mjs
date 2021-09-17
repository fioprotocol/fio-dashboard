import mailchimpProvider from '@mailchimp/mailchimp_transactional';
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
          body: `Thank you for creating a FIO Dashboard account.

Please remember that for your security FIO Dashboard Team does not have access to your password or your private keys. We cannot reset your password in case you forget it, like many website do. It is very important that you write down your password in a secure location.

You should also set-up Password Recovery, which will require you to set-up two secret questions and answers and send an email to you to access Password Recovery in the future. If you forget the password, you will be asked to click a link in the Password Recovery email and answer the secret questions. If you do not have access to the email or do not remember the secret answers, FIO Dashboard Team will not be able to reset your password and you will not be able to access the FIO Dashboard.

FIO Dashboard Team.
`,
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
