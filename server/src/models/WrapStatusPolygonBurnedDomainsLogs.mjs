import Sequelize from 'sequelize';

import Base from './Base';

import { extractDomainBurnValue } from '../utils/wrap.mjs';

const { DataTypes: DT } = Sequelize;

export class WrapStatusPolygonBurnedDomainsLogs extends Base {
  static init(sequelize) {
    super.init(
      {
        transactionHash: { type: DT.STRING, primaryKey: true },
        obtId: { type: DT.STRING, allowNull: false },
        domain: { type: DT.STRING, allowNull: true },
        data: { type: DT.JSON },
      },
      {
        sequelize,
        tableName: 'wrap-status-polygon-burned-domains-logs',
        timestamps: false,
      },
    );
  }

  static attrs(type = 'default') {
    const attributes = {
      default: ['transactionHash', 'obtId', 'domain', 'data'],
    };

    if (type in attributes) {
      return attributes[type];
    }

    return attributes.default;
  }

  static async addLogs(data) {
    const records = data.map(log => ({
      transactionHash: log.transactionHash,
      obtId: log.returnValues.obtid,
      domain: extractDomainBurnValue(log.returnValues.obtid),
      data: log,
    }));

    return this.bulkCreate(records, {
      updateOnDuplicate: ['obtId', 'domain', 'data'],
    });
  }
}
