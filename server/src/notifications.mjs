import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();
const notificationsContentPath = path.join(__dirname, 'notification-content.json');

let NotificationContent;

const getNotificationContent = () => {
  if (!NotificationContent) {
    try {
      NotificationContent = JSON.parse(fs.readFileSync(notificationsContentPath, 'utf8'));
    } catch (e) {
      NotificationContent = {};
    }
  }

  return NotificationContent;
};

export default getNotificationContent;
