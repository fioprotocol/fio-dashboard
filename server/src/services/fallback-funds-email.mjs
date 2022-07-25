import emailSender from '../services/emailSender.mjs';
import logger from '../logger.mjs';

import { templates } from '../emails/emailTemplate.mjs';

import { DAY_MS } from '../config/constants.js';

const TIMEOUT_HOURS = DAY_MS; // 24 hours
const lastInsufficientFundsNotificationSent = {
  date: null,
};

const sendInsufficientFundsNotification = async (
  fioName,
  refProfileName,
  authorization,
) => {
  const now = new Date();

  if (!lastInsufficientFundsNotificationSent.date) {
    lastInsufficientFundsNotificationSent.date = now.getTime() - 1000 * 60 * 60 * 25;
  }
  const diffHours = now.getTime() - lastInsufficientFundsNotificationSent.date;
  if (diffHours > TIMEOUT_HOURS) {
    try {
      await emailSender.send(
        templates.fallbackFundsEmail,
        process.env.REG_FALLBACK_NOTIFICATION_EMAIL,
        { fioName, refProfileName, authorization },
      );
    } catch (e) {
      logger.error('InsufficientFundsNotification send ERROR ===');
      logger.error(e);
    }

    lastInsufficientFundsNotificationSent.date = now.getTime();
  }
};

export default sendInsufficientFundsNotification;
