'use strict';

module.exports = {
  async up (QI, Sequelize) {
    let orders = [];
    let orderItems = [];
    let payments = [];
    let paymentEvents = [];
    let bcTxs = [];
    let bcTxEvents = [];
    let orderItemsStatuses = [];

    for (let i = 0; i < 10000000; i++) {
      const orderId = i;
      orders.push({
        id: orderId,
        total: '4.22',
        roe: 1.2,
        status: 'NEW',
        publicKey: 'FIO6YAzKSEbntKZ9o8d4jE8iDiEmFFHsKsCYSyL6PmbbBGe3tmFjQ',
        data: JSON.stringify({ testing: true }),
        customerIp: '46.211.18.213',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Order Items
      const orderItemId1 = i * 2
      const orderItemId2 = i * 2 + 1
      const ch1 = `testingcryptohandle${orderItemId1}@regtest`;
      const ch2 = `testingcryptohandle${orderItemId2}@regtest`;
      orderItems.push({
        id: orderItemId1,
        action: 'registerFioAddress',
        params: JSON.stringify({ name: ch1 }),
        nativeFio: null,
        price: null,
        priceCurrency: 'USDC',
        orderId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      orderItems.push({
        id: orderItemId2,
        action: 'registerFioAddress',
        params: JSON.stringify({ name: ch2 }),
        nativeFio: 100000,
        price: '2.11',
        priceCurrency: 'USDC',
        orderId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Payments
      const paymentId1 = i * 2
      const paymentId2 = i * 2 + 1
      payments.push({
        id: paymentId1,
        processor: 'COINBASE',
        externalId: `DKFOSPEO${paymentId1}`,
        externalPaymentUrl: `https://commerce.coinbase.com/charges/DKFOSPEO${paymentId1}`,
        price: '2.11',
        currency: 'USDC',
        status: 'EXPIRED',
        orderId,
      })

      payments.push({
        id: paymentId2,
        processor: 'COINBASE',
        externalId: `DKFOSPEO${paymentId2}`,
        externalPaymentUrl: `https://commerce.coinbase.com/charges/DKFOSPEO${paymentId2}`,
        price: '2.11',
        currency: 'USDC',
        status: 'COMPLETED',
        orderId,
      })

      // Payment events
      const paymentEventId1 = i * 5
      const paymentEventId2 = i * 5 + 1
      const paymentEventId3 = i * 5 + 2
      const paymentEventId4 = i * 5 + 3
      const paymentEventId5 = i * 5 + 4

      paymentEvents.push({
        id: paymentEventId1,
        status: 'PENDING',
        statusNotes: '',
        paymentId: paymentId1,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      paymentEvents.push({
        id: paymentEventId2,
        status: 'REVIEW',
        statusNotes: '',
        paymentId: paymentId1,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      paymentEvents.push({
        id: paymentEventId3,
        status: 'PENDING',
        statusNotes: 'New',
        paymentId: paymentId2,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      paymentEvents.push({
        id: paymentEventId4,
        status: 'PENDING',
        statusNotes: 'Pending',
        paymentId: paymentId2,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      paymentEvents.push({
        id: paymentEventId5,
        status: 'SUCCESS',
        statusNotes: '',
        paymentId: paymentId2,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Txs
      const bcTxId1 = i * 3
      const bcTxId2 = i * 3 + 1
      const bcTxId3 = i * 3 + 2
      bcTxs.push({
        id: bcTxId1,
        action: 'registerFioAddress',
        data: JSON.stringify({
          params: { name: ch1 }
        }),
        expiration: '2020-04-02 15:26:35+00',
        status: 'REVIEW',
        orderItemId: orderItemId1,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      bcTxs.push({
        id: bcTxId2,
        action: 'registerFioAddress',
        data: JSON.stringify({
          params: { name: ch1 }
        }),
        expiration: '2020-04-02 15:26:35+00',
        txId: `93dd0585cc20a44c288265d5471bd66232${bcTxId2}`,
        blockNum: bcTxId2,
        status: 'SUCCESS',
        orderItemId: orderItemId1,
        blockTime: new Date(bcTxId2),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      bcTxs.push({
        id: bcTxId3,
        action: 'registerFioAddress',
        data: JSON.stringify({
          params: { name: ch2 }
        }),
        expiration: '2020-04-02 15:26:35+00',
        txId: `93dd0585cc20a44c288265d5471bd66232${bcTxId3}`,
        blockNum: bcTxId3,
        blockTime: new Date(bcTxId3),
        status: 'SUCCESS',
        orderItemId: orderItemId2,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Tx Events
      const bcTxEventId1 = i * 6
      const bcTxEventId2 = i * 6 + 1
      const bcTxEventId3 = i * 6 + 2
      const bcTxEventId4 = i * 6 + 3
      const bcTxEventId5 = i * 6 + 4
      const bcTxEventId6 = i * 6 + 5

      bcTxEvents.push({
        id: bcTxEventId1,
        status: 'PENDING',
        statusNotes: '',
        blockchainTransactionId: bcTxId1,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      bcTxEvents.push({
        id: bcTxEventId2,
        status: 'REVIEW',
        statusNotes: 'Some error',
        blockchainTransactionId: bcTxId1,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      bcTxEvents.push({
        id: bcTxEventId3,
        status: 'PENDING',
        statusNotes: '',
        blockchainTransactionId: bcTxId2,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      bcTxEvents.push({
        id: bcTxEventId4,
        status: 'SUCCESS',
        statusNotes: '',
        blockchainTransactionId: bcTxId2,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      bcTxEvents.push({
        id: bcTxEventId5,
        status: 'PENDING',
        statusNotes: '',
        blockchainTransactionId: bcTxId3,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      bcTxEvents.push({
        id: bcTxEventId6,
        status: 'SUCCESS',
        statusNotes: '',
        blockchainTransactionId: bcTxId3,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Order items status

      orderItemsStatuses.push({
        id: orderItemId1,
        txStatus: 3,
        paymentStatus: 3,
        blockchainTransactionId: bcTxId2,
        paymentId: paymentId2,
        orderItemId: orderItemId1,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      orderItemsStatuses.push({
        id: orderItemId2,
        txStatus: 3,
        paymentStatus: 3,
        blockchainTransactionId: bcTxId3,
        paymentId: paymentId2,
        orderItemId: orderItemId2,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      if (i % 200 === 0) {
        await QI.bulkInsert('orders', orders, {});
        await QI.bulkInsert('order-items', orderItems, {});
        await QI.bulkInsert('payments', payments, {});
        await QI.bulkInsert('payment-event-logs', paymentEvents, {});
        await QI.bulkInsert('blockchain-transactions', bcTxs, {});
        await QI.bulkInsert('blockchain-transaction-event-logs', bcTxEvents, {});
        await QI.bulkInsert('order-items-status', orderItemsStatuses, {});

        orders = [];
        orderItems = [];
        payments = [];
        paymentEvents = [];
        bcTxs = [];
        bcTxEvents = [];
        orderItemsStatuses = [];
      }
    }
  },

  async down (QI, Sequelize) {
    await QI.bulkDelete('blockchain-transactions-status', null, {});
    await QI.bulkDelete('blockchain-transaction-event-logs', null, {});
    await QI.bulkDelete('blockchain-transactions', null, {});
    await QI.bulkDelete('payment-event-logs', null, {});
    await QI.bulkDelete('payments', null, {});
    await QI.bulkDelete('order-items', null, {});
    await QI.bulkDelete('orders', null, {});
  }
};
