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
        isWrap: { type: DT.BOOLEAN, defaultValue: false },
        isBurn: { type: DT.BOOLEAN, defaultValue: false },
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
      default: ['id', 'blockNumber', 'networkId', 'isWrap', 'isBurn'],
    };

    if (type in attributes) {
      return attributes[type];
    }

    return attributes.default;
  }

  static async getBlockNumber(networkId, isWrap = false, isBurn = false) {
    const data = await this.findOne({ where: { networkId, isWrap, isBurn } });
    return parseInt(data.blockNumber);
  }

  static async setBlockNumber(value, networkId, isWrap = false, isBurn = false) {
    return WrapStatusBlockNumbers.update(
      { blockNumber: value },
      { where: { networkId, isWrap, isBurn } },
    );
  }
}
