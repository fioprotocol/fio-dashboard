'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.createTable('payments', {
      id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
      processor: {
        type: DT.STRING,
        allowNull: false,
        comment: 'COINBASE, COINPAYMENTS, ADMIN, etc',
      },
      externalId: {
        type: DT.STRING,
        allowNull: true,
        comment: 'Payment id from processor data',
      },
      externalPaymentUrl: {
        type: DT.STRING,
        allowNull: true,
        comment: 'Link to external payment page',
      },
      price: { type: DT.STRING, allowNull: true, comment: 'Total price' },
      currency: {
        type: DT.STRING,
        allowNull: true,
        comment: 'Payment currency - USDC, ETH, ...',
      },
      status: {
        type: DT.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: 'NEW (1), PENDING (2), CANCELLED (5), EXPIRED (4), COMPLETED (3)',
      },
      data: { type: DT.JSON, comment: 'Any additional data for the payment' },
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

    await QI.createTable('payment-event-logs', {
      id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
      status: {
        type: DT.INTEGER,
        defaultValue: 1,
        comment:
          'PENDING (2) / SUCCESS (3) / REVIEW (4) / CANCEL (5). A "REVIEW" is a system or payment anomaly.',
      },
      statusNotes: { type: DT.STRING, comment: 'Status details' },
      data: { type: DT.JSON, comment: 'Any additional data for the item' },
      paymentId: {
        type: DT.BIGINT,
        references: {
          model: 'payments',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
        allowNull: false,
      },
      createdAt: { type: DT.DATE },
      updatedAt: { type: DT.DATE },
      deletedAt: { type: DT.DATE },
    });

    await QI.createTable('blockchain-transactions', {
      id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
      action: {
        type: DT.STRING,
        comment:
          'Action name. registerFioAddress / renewFioDomain / addBundledTransactions etc.',
      },
      expiration: {
        type: DT.DATE,
        allowNull: true,
        comment: 'Blockchain transaction expiration',
      },
      txId: {
        type: DT.STRING,
        comment: 'Transaction ID',
      },
      blockNum: {
        type: DT.INTEGER,
        comment: 'Block for this transaction',
      },
      blockTime: {
        type: DT.DATE,
        comment: 'Block time for this transaction, used to determine irreversibility',
      },
      status: {
        type: DT.INTEGER,
        defaultValue: 1,
        comment:
          'Last action processing status. READY (1) / PENDING (2) / RETRY (6) / SUCCESS (3) / REVIEW (4) / CANCEL (5) etc.',
      },
      data: { type: DT.JSON, comment: 'Any additional data' },
      orderItemId: {
        type: DT.BIGINT,
        references: {
          model: 'order-items',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'set null',
        allowNull: true,
      },
      createdBy: {
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

    await QI.createTable('blockchain-transaction-event-logs', {
      id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
      status: {
        type: DT.INTEGER,
        defaultValue: 1,
        comment:
          'READY (1) / PENDING (2) / RETRY (6) / SUCCESS (3) / REVIEW (4) / CANCEL (5) etc. A "REVIEW" is an unexpected system or broadcast exception. An "EXPIRE" will resend several times and move to "SUCCESS" or "REVIEW".  The admin will "REVIEW" then "RETRY" or "CANCEL".',
      },
      statusNotes: { type: DT.STRING, comment: 'Status details' },
      data: { type: DT.JSON, comment: 'Any additional data for the item' },
      blockchainTransactionId: {
        type: DT.BIGINT,
        references: {
          model: 'blockchain-transactions',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
        allowNull: false,
      },
      createdAt: { type: DT.DATE },
      updatedAt: { type: DT.DATE },
      deletedAt: { type: DT.DATE },
    });

    await QI.createTable('order-items-status', {
      id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
      paymentStatus: {
        type: DT.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: 'NEW (1), PENDING (2), CANCELLED (5), EXPIRED (4), COMPLETED (3)',
      },
      txStatus: {
        type: DT.INTEGER,
        defaultValue: 1,
        comment:
          'Last action processing status. READY (1) / PENDING (2) / RETRY (6) / SUCCESS (3) / REVIEW (4) / CANCEL (5) etc.',
      },
      paymentId: {
        type: DT.BIGINT,
        references: {
          model: 'payments',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'set null',
        allowNull: true,
      },
      blockchainTransactionId: {
        type: DT.BIGINT,
        references: {
          model: 'blockchain-transactions',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'set null',
        allowNull: true,
        comment: 'Last record in order-items table for the status',
      },
      orderItemId: {
        type: DT.BIGINT,
        references: {
          model: 'order-items',
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

    // Indexes

    await QI.addIndex('payments', ['id'], {
      fields: ['id'],
    });
    await QI.addIndex('payments', ['status'], {
      fields: ['status'],
    });
    await QI.addIndex('payments', ['orderId'], {
      fields: ['orderId'],
    });

    await QI.addIndex('payment-event-logs', ['status'], {
      fields: ['status'],
    });
    await QI.addIndex('payment-event-logs', ['paymentId'], {
      fields: ['paymentId'],
    });

    await QI.addIndex('blockchain-transactions', ['id'], {
      fields: ['id'],
    });
    await QI.addIndex('blockchain-transactions', ['txId'], {
      fields: ['txId'],
      unique: true,
    });
    await QI.addIndex('blockchain-transactions', ['orderItemId'], {
      fields: ['orderItemId'],
    });
    await QI.addIndex('blockchain-transactions', ['action'], {
      fields: ['action'],
    });
    await QI.addIndex('blockchain-transactions', ['status'], {
      fields: ['status'],
    });

    await QI.addIndex('blockchain-transaction-event-logs', ['blockchainTransactionId'], {
      fields: ['blockchainTransactionId'],
    });
    await QI.addIndex('blockchain-transaction-event-logs', ['status'], {
      fields: ['status'],
    });

    await QI.addIndex('order-items-status', ['id'], {
      fields: ['id'],
    });
    await QI.addIndex('order-items-status', ['txStatus'], {
      fields: ['txStatus'],
    });
    await QI.addIndex('order-items-status', ['paymentStatus'], {
      fields: ['paymentStatus'],
    });
    await QI.addIndex('order-items-status', ['txStatus', 'paymentStatus'], {
      fields: ['txStatus', 'paymentStatus'],
    });
    await QI.addIndex('order-items-status', ['orderItemId'], {
      fields: ['orderItemId'],
    });
    await QI.addIndex('order-items-status', ['blockchainTransactionId'], {
      fields: ['blockchainTransactionId'],
    });
    await QI.addIndex('order-items-status', ['paymentId'], {
      fields: ['paymentId'],
    });
  },

  down: async QI => {
    await QI.dropTable('order-items-status');
    await QI.dropTable('blockchain-transaction-event-logs');
    await QI.dropTable('blockchain-transactions');
    await QI.dropTable('payment-event-logs');
    return QI.dropTable('payments');
  },
};
