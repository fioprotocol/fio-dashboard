import Sequelize from 'sequelize';

import Base from './Base';

const { DataTypes: DT } = Sequelize;

export class Var extends Base {
  static init(sequelize) {
    super.init(
      {
        id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        key: { type: DT.STRING, allowNull: false },
        value: { type: DT.TEXT, allowNull: false },
      },
      {
        sequelize,
        tableName: 'vars',
      },
    );
  }

  static async getByKey(key) {
    return this.findOne({ where: { key } });
  }

  static async getValByKey(key) {
    const varItem = await this.findOne({ raw: true, where: { key } });

    return varItem ? varItem.value : null;
  }

  static async setValue(key, value) {
    const varItem = await this.getByKey(key);
    if (!varItem) return Var.create({ key, value });
    return Var.update({ value }, { where: { key } });
  }

  /**
   *
   * @param {string} lastUpdated
   * @param {number} timeout ms
   * @returns {boolean}
   */
  static updateRequired(lastUpdated, timeout) {
    const now = new Date();
    const diff = now.getTime() - new Date(lastUpdated).getTime();

    return diff > timeout;
  }

  static format({ id, key, value, createdAt, updatedAt }) {
    return {
      id,
      key,
      value,
      createdAt,
      updatedAt,
    };
  }
}
