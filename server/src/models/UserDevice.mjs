import Sequelize from 'sequelize';

import Base from './Base';

import { User } from './User';

import emailSender from '../services/emailSender.mjs';

import { templates } from '../emails/emailTemplate.mjs';

import logger from '../logger.mjs';

const { DataTypes: DT } = Sequelize;

export class UserDevice extends Base {
  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        hash: { type: DT.STRING, allowNull: false },
        info: { type: DT.JSON, allowNull: false },
      },
      {
        sequelize,
        tableName: 'user-devices',
        indexes: [
          {
            fields: ['hash'],
            using: 'BTREE',
          },
          {
            fields: ['userId', 'hash'],
            unique: true,
            name: 'user_devices_user_hash_unique',
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
      const userDevice = new UserDevice({
        userId,
        hash: device.hash,
        info: device.info,
      });

      await userDevice.save();
    } catch (error) {
      logger.error(`Error creating user device`, error);
    }
  }

  static async check(user, device) {
    try {
      const userDevice = await this.findOne({
        where: {
          userId: user.id,
          hash: device.hash,
        },
      });

      if (!userDevice) {
        const userDevices = await this.findAll({
          where: {
            userId: user.id,
          },
        });
        if (userDevices && userDevices.length > 0)
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

        await this.add(user.id, device);
      }
    } catch (error) {
      logger.error(`Error checking user device`, error);
    }
  }

  static format({ id, hash, info, createdAt }) {
    return {
      id,
      hash,
      info,
      createdAt,
    };
  }
}
