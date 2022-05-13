'use strict';

module.exports = {
  up: async (QI, DT) => {
    return await QI.addColumn('users', 'refProfileId', {
      type: DT.BIGINT,
      references: {
        model: 'referrer-profiles',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'set null',
      allowNull: true,
    });
  },

  down: async QI => {
    return QI.removeColumn('users', 'refProfileId');
  },
};
