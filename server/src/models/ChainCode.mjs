import Sequelize from 'sequelize';

import Base from './Base.mjs';

import { TokenCode } from './TokenCode.mjs';

const { DataTypes: DT, Op } = Sequelize;

export class ChainCode extends Base {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DT.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        chainCodeId: {
          type: DT.STRING,
          unique: true,
        },
        chainCodeName: { type: DT.STRING },
      },
      {
        sequelize,
        tableName: 'chain-codes-list',
        timestamps: false,
      },
    );
  }

  static associate() {
    this.hasMany(TokenCode, {
      foreignKey: 'chainCodeId',
      sourceKey: 'chainCodeId',
    });
  }

  static list(chainCode) {
    const where = {
      [Op.or]: [
        {
          chainCodeId: {
            [Op.iRegexp]: `^${chainCode}`,
          },
        },
        {
          chainCodeName: {
            [Op.iRegexp]: `${chainCode}`,
          },
        },
      ],
    };

    return this.findAll({
      where,
      include: [TokenCode],
    });
  }

  static selectedChainCodesList(chainCodes) {
    const where = {
      chainCodeId: {
        [Op.in]: chainCodes,
      },
    };

    return this.findAll({
      where,
      include: [TokenCode],
    });
  }

  static format({ chainCodeId, chainCodeName, TokenCodes: tokenCodesList }) {
    const chainCodeItem = {
      chainCodeId,
      chainCodeName,
    };

    if (tokenCodesList && tokenCodesList.length) {
      chainCodeItem.tokens = [];
      tokenCodesList.forEach(tokenCodeItem =>
        chainCodeItem.tokens.push(TokenCode.format(tokenCodeItem)),
      );
    }

    return {
      ...chainCodeItem,
    };
  }
}
