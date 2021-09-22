import mailchimpProvider from '@mailchimp/mailchimp_transactional';
import EmailTemplate, { templates } from './../emails/emailTemplate';
import config from './../config';
import logger from './../logger';

const EMAIL_SENT_STATUS = 'sent';

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
      logger.error(err.toJSON());
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
          body: EmailTemplate.get(templateName, {}),
          images: EmailTemplate.getInlineImages(templateName),
        };
      case templates.confirmEmail:
        return {
          subject: 'FIO Dashboard - please confirm your email',
          body: EmailTemplate.get(templateName, {
            link: `${sendData.mainUrl}confirmEmail/${sendData.hash}`,
          }),
          images: EmailTemplate.getInlineImages(templateName),
        };
      case templates.passRecovery:
        return {
          subject: 'FIO Dashboard recovery link',
          body: EmailTemplate.get(templateName, {
            link: `${sendData.mainUrl}account-recovery?username=${sendData.username}&token=${sendData.token}`,
          }),
          images: EmailTemplate.getInlineImages(templateName),
        };
    }
    throw new Error(`There is no email template with such name - ${templateName}`);
  }
}

export default new EmailSender();
