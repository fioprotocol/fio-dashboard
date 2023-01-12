import Sequelize from 'sequelize';
import Base from './Base';

const { DataTypes: DT } = Sequelize;

export class Username extends Base {
  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        username: {
          type: DT.STRING,
          allowNull: true,
        },
        rank: {
          type: DT.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
      },
      {
        sequelize,
        tableName: 'usernames',
        paranoid: true,
      },
    );
  }
}
