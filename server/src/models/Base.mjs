import Sequelize from 'sequelize';
import _ from 'lodash';

export default class Base extends Sequelize.Model {
  static findOneWhere(where) {
    return this.findOne({ where });
  }

  json(fields = this.constructor.attrs()) {
    return _.pick(this.toJSON(), fields);
  }
}
