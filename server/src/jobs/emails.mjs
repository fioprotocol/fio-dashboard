import Sequelize from 'sequelize';
import { parentPort } from 'worker_threads';

import '../db';
import logger from '../logger.mjs';
import emailSender from '../services/emailSender.mjs';
import { User, Notification } from '../models/index.mjs';
import { templates } from '../emails/emailTemplate.mjs';

const NOTIFICATION_LIMIT_PER_JOB = 100;

// store boolean if the job is cancelled
let isCancelled = false;

// handle cancellation (this is a very simple example)
if (parentPort)
  parentPort.once('message', message => {
    if (message === 'cancel') isCancelled = true;
  });

(async () => {
  const notifications = await Notification.findAll({
    where: {
      emailDate: {
        [Sequelize.Op.is]: null,
      },
    },
    limit: NOTIFICATION_LIMIT_PER_JOB,
  });

  parentPort.postMessage(`Process notifications - ${notifications.length}`);
  const handleNotification = async notification => {
    if (isCancelled) return false;

    parentPort.postMessage(`Processing notification id - ${notification.id}`);

    try {
      const { data } = notification;

      if (!data.emailTemplate) return false;

      let emailSent = false;
      try {
        const user = await User.findActive(notification.userId);
        const emailResult = await emailSender.send(
          templates[data.emailTemplate],
          user.email,
          data.emailData,
        );

        emailSent = !!emailResult;
      } catch (e) {
        logger.error(`EMAIL SEND ERROR`, e);
      }

      if (emailSent) {
        notification.emailDate = new Date();
        await notification.save();
        parentPort.postMessage(`Notification processed, email sent - ${notification.id}`);
      }
    } catch (e) {
      logger.error(`NOTIFICATION PROCESSING ERROR`, e);
    }

    return true;
  };

  const methods = notifications.map(notification => handleNotification(notification));

  await Promise.allSettled(methods);

  process.exit(0);
})();
