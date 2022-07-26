'use strict';
const fs = require('fs');
const path = require('path');

const pathToFile = path.join(__dirname, '../databaseTables/tokenCodesList.json');

const TOKEN_CODE_TABLE_NAME = 'token-codes-list';

module.exports = {
  up: async (QI, DT) => {
    await QI.createTable(TOKEN_CODE_TABLE_NAME, {
      id: {
        type: DT.BIGINT,
        autoIncrement: true,
      },
      chainCodeId: {
        type: DT.STRING,
        references: {
          model: 'chain-codes-list',
          key: 'chainCodeId',
        },
      },
      tokenCodeId: {
        type: DT.STRING,
      },
      tokenCodeName: { type: DT.STRING },
    });

    fs.readFile(pathToFile, async function(err, data) {
      try {
        const parsedArray = JSON.parse(data.toString());

        await QI.bulkInsert(TOKEN_CODE_TABLE_NAME, parsedArray);
      } catch (err) {
        console.error(err); // eslint-disable-line no-console
      }
    });
  },

  down: async QI => {
    return QI.dropTable(TOKEN_CODE_TABLE_NAME);
  },
};
