'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.createTable('orders', {
      id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
      total: { type: DT.STRING, allowNull: true, comment: 'Total cost' },
      roe: {
        type: DT.STRING,
        allowNull: false,
        comment: 'ROE value at the moment of order creation',
      },
      status: {
        type: DT.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment:
          'Order status: NEW (1) , PENDING (2), PAYMENT_AWAITING (3), PAID (4), TRANSACTION_EXECUTED (5), PARTIALLY_SUCCESS (6), DONE (7)',
      },
      data: { type: DT.JSON, comment: 'Any additional data for the order' },
      publicKey: {
        type: DT.STRING,
        allowNull: true,
        comment: 'Owner Wallet public key',
        defaultValue: null,
      },
      customerIp: {
        type: DT.STRING,
        allowNull: true,
        comment: 'IP Address of customer to limit free actions',
        defaultValue: null,
      },
      refProfileId: {
        type: DT.BIGINT,
        references: {
          model: 'referrer-profiles',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'set null',
        allowNull: true,
      },
      userId: {
        type: DT.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'set null',
        allowNull: true,
      },
      createdAt: { type: DT.DATE },
      updatedAt: { type: DT.DATE },
      deletedAt: { type: DT.DATE },
    });

    await QI.createTable('order-items', {
      id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
      action: {
        type: DT.STRING,
        allowNull: false,
        comment:
          'FIO API action. registerFioAddress / renewFioDomain / addBundledTransactions etc',
      },
      address: {
        type: DT.STRING,
        allowNull: true,
        comment: 'FIO Handle name, optional',
        defaultValue: null,
      },
      domain: {
        type: DT.STRING,
        allowNull: true,
        comment: 'FIO handle domain, optional',
        defaultValue: null,
      },
      params: { type: DT.JSON, comment: 'Params needed for the action' },
      nativeFio: { type: DT.STRING, allowNull: true, comment: 'Item price in FIO' },
      price: { type: DT.STRING, allowNull: true, comment: 'Item price in priceCurrency' },
      priceCurrency: {
        type: DT.STRING,
        allowNull: true,
        comment: 'USDC, ETH, ...',
        defaultValue: 'USDC',
      },
      data: { type: DT.JSON, comment: 'Any additional data for the item' },
      orderId: {
        type: DT.BIGINT,
        references: {
          model: 'orders',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'set null',
        allowNull: true,
      },
      createdAt: { type: DT.DATE },
      updatedAt: { type: DT.DATE },
      deletedAt: { type: DT.DATE },
    });

    await QI.addIndex('orders', ['refProfileId', 'publicKey', 'userId'], {
      fields: ['refProfileId', 'publicKey', 'userId'],
    });

    // Indexes
    await QI.addIndex('orders', ['id'], {
      fields: ['id'],
    });
    await QI.addIndex('orders', ['status'], {
      fields: ['status'],
    });
    await QI.addIndex('orders', ['userId'], {
      fields: ['userId'],
    });
    await QI.addIndex('order-items', ['id'], {
      fields: ['id'],
    });
    await QI.addIndex('order-items', ['address', 'domain'], {
      fields: ['address', 'domain'],
    });
    await QI.addIndex('order-items', ['orderId'], {
      fields: ['orderId'],
    });

    return;
  },

  down: async QI => {
    await QI.dropTable('order-items');
    return QI.dropTable('orders');
  },
};
