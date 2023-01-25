import Sequelize from 'sequelize';
import pick from 'lodash/pick';

export default class Base extends Sequelize.Model {
  static findOneWhere(where) {
    return this.findOne({ where });
  }

  json(fields = this.constructor.attrs()) {
    return pick(this.toJSON(), fields);
  }
}
