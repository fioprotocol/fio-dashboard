import Sequelize from 'sequelize';

import Base from './Base';

import { User } from './User';

import emailSender from '../services/emailSender.mjs';

import { templates } from '../emails/emailTemplate.mjs';

import logger from '../logger.mjs';

import { generateDeviceToken, verifyDeviceToken } from '../utils/crypto.mjs';

const { DataTypes: DT } = Sequelize;

export class UserDevice extends Base {
  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        deviceId: { type: DT.STRING, allowNull: false },
        info: { type: DT.JSON, allowNull: false },
      },
      {
        sequelize,
        tableName: 'user-devices',
        indexes: [
          {
            fields: ['deviceId'],
            using: 'BTREE',
          },
        ],
      },
    );
  }

  static associate() {
    this.belongsTo(User, {
      foreignKey: 'userId',
      targetKey: 'id',
    });
  }

  static async add(userId, device) {
    try {
      let deviceId = null;
      let token = device.token;

      if (token) {
        const decoded = verifyDeviceToken(token);
        if (decoded && decoded.deviceId) {
          deviceId = decoded.deviceId;
        }
      }

      if (!deviceId) {
        const deviceData = generateDeviceToken(device.info);
        deviceId = deviceData.deviceId;
        token = deviceData.token;
      }

      // Create new device record if it doesn't exist
      const userDevice = new UserDevice({
        userId,
        deviceId,
        info: device.info,
      });

      await userDevice.save();

      return { token, deviceId };
    } catch (error) {
      logger.error(`Error creating user device`, error);
      throw error;
    }
  }

  static async check(user, device) {
    let deviceId = null;
    let token = device.token;

    try {
      // If we have a token, verify it first
      if (device.token) {
        const decoded = verifyDeviceToken(device.token);
        if (decoded && decoded.deviceId) {
          deviceId = decoded.deviceId;
        }
      }

      // Look up user-device association
      let userDevice = null;

      if (deviceId) {
        userDevice = await this.findOne({
          where: {
            userId: user.id,
            deviceId,
          },
        });
      }

      if (!userDevice) {
        const userDevices = await this.findAll({
          where: {
            userId: user.id,
          },
        });

        if (userDevices && userDevices.length > 0) {
          await emailSender.send(
            templates.deviceSignIn,
            user.email,
            JSON.parse(
              JSON.stringify({
                device: `${device.info.deviceType}, ${device.info.platform}, ${device.info.userAgent}`,
                date: new Date().toLocaleString(),
                location: device.info.ip,
                email: user.email,
              }),
            ),
          );
        }

        // Add device for this user (creates new or associates existing)
        const result = await this.add(user.id, device);

        token = result.token;
      }

      return { token };
    } catch (error) {
      logger.error(`Error checking user device`, error);
    }
  }

  static format({ id, deviceId, info, createdAt }) {
    return {
      id,
      deviceId,
      info,
      createdAt,
    };
  }
}
