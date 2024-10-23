import Sequelize from 'sequelize';

import Base from './Base';
import { AdminUsersStatus } from './AdminUsersStatus.mjs';
import { AdminUsersRole } from './AdminUsersRole.mjs';

import { adminTfaValidate, compareHashString, generateHash } from '../tools.mjs';
import { ADMIN_ROLES_IDS, ADMIN_STATUS_IDS } from '../config/constants';

const { DataTypes: DT, Op } = Sequelize;

export class AdminUser extends Base {
  static get ROLE() {
    return {
      SUPER_ADMIN: ADMIN_ROLES_IDS.SUPER_ADMIN,
      ADMIN: ADMIN_ROLES_IDS.ADMIN,
    };
  }

  static get STATUS() {
    return ADMIN_STATUS_IDS;
  }

  static init(sequelize) {
    super.init(
      {
        id: {
          type: DT.UUID,
          defaultValue: DT.UUIDV4,
          primaryKey: true,
        },
        email: { type: DT.STRING, unique: true },
        password: {
          type: DT.STRING,
          set(value) {
            const hashedPassword = generateHash(value);
            this.setDataValue('password', hashedPassword);
          },
        },
        statusId: {
          type: DT.INTEGER,
          allowNull: false,
          defaultValue: 1,
          references: {
            model: 'admin-users-statuses',
            key: 'id',
          },
          onDelete: 'cascade',
        },
        roleId: {
          type: DT.INTEGER,
          allowNull: false,
          defaultValue: 1,
          references: {
            model: 'admin-users-roles',
            key: 'id',
          },
          onDelete: 'cascade',
        },
        tfaSecret: {
          type: DT.STRING,
          allowNull: true,
        },
        lastLogIn: {
          type: DT.DATE,
        },
      },
      {
        sequelize,
        tableName: 'admin-users',
        paranoid: true,
      },
    );
  }

  static associate() {
    this.belongsTo(AdminUsersRole, {
      foreignKey: 'roleId',
      targetKey: 'id',
      as: 'role',
    });
    this.belongsTo(AdminUsersStatus, {
      foreignKey: 'statusId',
      targetKey: 'id',
      as: 'status',
    });
  }

  static attrs(type = 'default') {
    const attributes = {
      default: ['id', 'email', 'lastLogIn', 'createdAt', 'role', 'status'],
    };

    if (type in attributes) {
      return attributes[type];
    }

    return attributes.default;
  }

  static findActive(id) {
    return this.findByPk(id, {
      where: { statusId: { [Op.ne]: ADMIN_STATUS_IDS.BLOCKED } },
      include: [
        {
          model: AdminUsersRole,
          attributes: ['id', 'role'],
          as: 'role',
        },
        {
          model: AdminUsersStatus,
          attributes: ['id', 'status'],
          as: 'status',
        },
      ],
    });
  }

  static profileInfo(id) {
    return this.findByPk(id, {
      include: [
        {
          model: AdminUsersRole,
          attributes: ['id', 'role'],
          as: 'role',
        },
        {
          model: AdminUsersStatus,
          attributes: ['id', 'status'],
          as: 'status',
        },
      ],
    });
  }

  static usersCount() {
    return this.count();
  }

  static list(limit = 25, offset = 0) {
    return this.findAll({
      include: [
        {
          model: AdminUsersRole,
          attributes: ['id', 'role'],
          as: 'role',
        },
        {
          model: AdminUsersStatus,
          attributes: ['id', 'status'],
          as: 'status',
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });
  }

  checkPassword(password) {
    return compareHashString(password, this.get('password'));
  }

  tfaValidate(token) {
    return adminTfaValidate(this.get('tfaSecret'), token);
  }
}
