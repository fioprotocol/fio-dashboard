import { Var } from '../models/index.mjs';

import emailSender from '../services/emailSender.mjs';
import logger from '../logger.mjs';

import { templates } from '../emails/emailTemplate.mjs';

import { DAY_MS } from '../config/constants.js';

const TIMEOUT_HOURS = DAY_MS; // 24 hours
const INSUFFICIENT_FUNDS_NOTIFICATION_VAR_KEY = 'INSUFFICIENT_FUNDS_NOTIFICATION';

const sendInsufficientFundsNotification = async (
  fioName,
  refProfileName,
  authorization,
) => {
  const lastInsufficientFundsNotificationSent = await Var.getByKey(
    INSUFFICIENT_FUNDS_NOTIFICATION_VAR_KEY,
  );

  if (
    !lastInsufficientFundsNotificationSent ||
    Var.updateRequired(lastInsufficientFundsNotificationSent.updatedAt, TIMEOUT_HOURS)
  ) {
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

    await Var.setValue(INSUFFICIENT_FUNDS_NOTIFICATION_VAR_KEY, new Date().getTime());
  }
};

export default sendInsufficientFundsNotification;
