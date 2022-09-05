import Sequelize from 'sequelize';

import '../db';
import { User, Notification } from '../models/index.mjs';
import CommonJob from './job.mjs';

import emailSender from '../services/emailSender.mjs';
import { templates } from '../emails/emailTemplate.mjs';

import logger from '../logger.mjs';

const NOTIFICATION_LIMIT_PER_JOB = 100;
const CONTENT_TYPE_EMAIL_TEMPLATE_MAP = {
  [Notification.CONTENT_TYPE.NEW_FIO_REQUEST]: templates.newFioRequest,
  [Notification.CONTENT_TYPE.FIO_REQUEST_APPROVED]: templates.approveFioRequest,
  [Notification.CONTENT_TYPE.FIO_REQUEST_REJECTED]: templates.rejectFioRequest,
  [Notification.CONTENT_TYPE.BALANCE_CHANGED]: templates.balanceChange,
  [Notification.CONTENT_TYPE.DOMAIN_EXPIRE]: templates.expiringDomains,
  [Notification.CONTENT_TYPE.LOW_BUNDLE_TX]: templates.lowBundleCount,
  [Notification.CONTENT_TYPE.PURCHASE_CONFIRMATION]: templates.purchaseConfirmation,
};

class EmailsJob extends CommonJob {
  constructor() {
    super();
  }

  async execute() {
    const notifications = await Notification.findAll({
      where: {
        emailDate: {
          [Sequelize.Op.is]: null,
        },
        contentType: {
          [Sequelize.Op.in]: [
            Notification.CONTENT_TYPE.DOMAIN_EXPIRE,
            Notification.CONTENT_TYPE.LOW_BUNDLE_TX,
            Notification.CONTENT_TYPE.BALANCE_CHANGED,
            Notification.CONTENT_TYPE.NEW_FIO_REQUEST,
            Notification.CONTENT_TYPE.FIO_REQUEST_APPROVED,
            Notification.CONTENT_TYPE.FIO_REQUEST_REJECTED,
            Notification.CONTENT_TYPE.PURCHASE_CONFIRMATION,
          ],
        },
      },
      include: [
        {
          model: User,
          where: { status: User.STATUS.ACTIVE },
          attributes: ['id', 'email'],
        },
      ],
      limit: NOTIFICATION_LIMIT_PER_JOB,
      raw: true,
      nest: true,
    });

    this.postMessage(`Process notifications - ${notifications.length}`);

    const handleNotifications = notifications => async () => {
      if (this.isCancelled) return false;

      this.postMessage(`Processing notifications id - ${notifications.map(n => n.id)}`);

      try {
        const {
          data,
          contentType,
          User: { email },
        } = notifications[0];

        if (!data.emailData || !Object.keys(data.emailData).length) return false;

        let sentEmailId = null;
        try {
          let emailData = data.emailData;

          if (contentType === Notification.CONTENT_TYPE.LOW_BUNDLE_TX) {
            emailData = {
              fioCryptoHandles: notifications.map(n => n.data.emailData),
            };
          }

          if (contentType === Notification.CONTENT_TYPE.DOMAIN_EXPIRE) {
            emailData = {
              domains: notifications.map(n => n.data.emailData),
              expiringStatus: data.emailData.domainExpPeriod,
            };
          }

          const emailResult = await emailSender.send(
            CONTENT_TYPE_EMAIL_TEMPLATE_MAP[contentType],
            email,
            emailData,
          );

          sentEmailId = emailResult ? emailResult._id : null;
        } catch (e) {
          logger.error(`EMAIL SEND ERROR`, e);
        }

        if (sentEmailId) {
          for (const notification of notifications) {
            await Notification.update(
              { emailDate: new Date(), data: { ...notification.data, sentEmailId } },
              { where: { id: notification.id } },
            );
          }
          this.postMessage(
            `Notification processed, email sent - ${notifications.map(n => n.id)}`,
          );
        }
      } catch (e) {
        logger.error(`NOTIFICATION PROCESSING ERROR`, e);
      }

      return true;
    };

    const notificationGroups = notifications.reduce((acc, notification) => {
      if (!notification.data || !notification.data.emailData) return acc;

      const firstSimilar = notifications.find(searchingItem => {
        if (
          notification.userId !== searchingItem.userId ||
          notification.contentType !== searchingItem.contentType ||
          !searchingItem.data ||
          !searchingItem.data.emailData
        )
          return false;

        const {
          data: { emailData },
        } = searchingItem;

        // join domains into one notification email
        if (
          notification.contentType === Notification.CONTENT_TYPE.DOMAIN_EXPIRE &&
          emailData.domainExpPeriod === notification.data.emailData.domainExpPeriod &&
          emailData.name !== notification.data.emailData.name
        )
          return true;

        return false;
      });

      if (firstSimilar && acc[firstSimilar.id]) {
        acc[firstSimilar.id] = [...acc[firstSimilar.id], notification];
      } else acc[notification.id] = [notification];

      return acc;
    }, {});

    const methods = Object.values(notificationGroups).map(sortedNotifications =>
      handleNotifications(sortedNotifications),
    );

    await this.executeActions(methods);

    this.finish();
  }
}

new EmailsJob().execute();
