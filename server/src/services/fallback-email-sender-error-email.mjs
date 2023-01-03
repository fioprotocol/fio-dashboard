import { Var } from '../models/index.mjs';

import emailSender from '../services/emailSender.mjs';
import logger from '../logger.mjs';

import { templates } from '../emails/emailTemplate.mjs';

import { DAY_MS } from '../config/constants.js';

const TIMEOUT_HOURS = DAY_MS; // 24 hours
const EMAIL_SENDER_ERROR_NOTIFICATION_VAR_KEY = 'EMAIL_SENDER_ERROR_NOTIFICATION';

const sendEmailSenderErrorNotification = async () => {
  const lastEmailSenderErrorNotification_Sent = await Var.getByKey(
    EMAIL_SENDER_ERROR_NOTIFICATION_VAR_KEY,
  );

  if (
    !lastEmailSenderErrorNotification_Sent ||
    Var.updateRequired(lastEmailSenderErrorNotification_Sent.updatedAt, TIMEOUT_HOURS)
  ) {
    try {
      await emailSender.send(
        templates.emailSenderErrorEmail,
        process.env.REG_FALLBACK_NOTIFICATION_EMAIL,
        {},
      );
    } catch (e) {
      logger.error('EmailSenderErrorNotification send ERROR ===');
      logger.error(e);
    }

    await Var.setValue(EMAIL_SENDER_ERROR_NOTIFICATION_VAR_KEY, new Date().getTime());
  }
};

export default sendEmailSenderErrorNotification;
