'use strict';
const fs = require('fs');
const path = require('path');

const pathToFile = path.join(__dirname, '../databaseTables/chainCodesList.json');

const CHAIN_CODE_TABLE_NAME = 'chain-codes-list';

module.exports = {
  up: async (QI, DT) => {
    await QI.createTable(CHAIN_CODE_TABLE_NAME, {
      id: {
        type: DT.BIGINT,
        autoIncrement: true,
      },
      chainCodeId: {
        type: DT.STRING,
        unique: true,
      },
      chainCodeName: { type: DT.STRING },
    });

    fs.readFile(pathToFile, async function(err, data) {
      try {
        await QI.bulkInsert(CHAIN_CODE_TABLE_NAME, JSON.parse(data.toString()));
      } catch (err) {
        console.error(err); // eslint-disable-line no-console
      }
    });
  },

  down: async QI => {
    return QI.dropTable(CHAIN_CODE_TABLE_NAME);
  },
};
