import Sequelize from 'sequelize';

import Base from './Base';
import { WrapStatusNetworks } from './WrapStatusNetworks.mjs';

const { DataTypes: DT } = Sequelize;

export class WrapStatusBlockNumbers extends Base {
  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        blockNumber: { type: DT.STRING, defaultValue: '0' },
        networkId: {
          type: DT.BIGINT,
          references: {
            model: 'wrap-status-networks',
            key: 'id',
          },
          onUpdate: 'cascade',
          onDelete: 'cascade',
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'wrap-status-block-numbers',
      },
    );
  }

  static associate() {
    this.belongsTo(WrapStatusNetworks, {
      foreignKey: 'networkId',
      targetKey: 'id',
    });
  }

  static attrs(type = 'default') {
    const attributes = {
      default: ['id', 'blockNumber', 'networkId'],
    };

    if (type in attributes) {
      return attributes[type];
    }

    return attributes.default;
  }

  /**
   * Get block number for a network
   * @param {number} networkId - Network ID
   * @returns {Promise<number>}
   */
  static async getBlockNumber({ networkId }) {
    const data = await this.findOne({
      where: {
        networkId,
      },
    });

    if (!data) {
      // If no record exists, create one
      await this.create({
        networkId,
        blockNumber: '0',
      });
      return 0;
    }

    return parseInt(data.blockNumber);
  }

  /**
   * Set block number for a network (simplified)
   * @param {number} value - Block number
   * @param {number} networkId - Network ID
   * @returns {Promise}
   */
  static async setBlockNumber({ value, networkId }) {
    const [record, created] = await this.findOrCreate({
      where: {
        networkId,
      },
      defaults: {
        blockNumber: value.toString(),
      },
    });

    if (!created) {
      await record.update({ blockNumber: value.toString() });
    }

    return record;
  }

  /**
   * Get all network block numbers
   * @returns {Promise<Array>}
   */
  static async getAllBlockNumbers() {
    return this.findAll({
      include: [
        {
          model: WrapStatusNetworks,
          attributes: ['id', 'name'],
        },
      ],
    });
  }

  /**
   * Reset block number for a network
   * @param {number} networkId - Network ID
   * @param {number} blockNumber - New block number (default 0)
   * @returns {Promise}
   */
  static async resetBlockNumber({ networkId, blockNumber = 0 }) {
    return this.setBlockNumber({ value: blockNumber, networkId });
  }
}
