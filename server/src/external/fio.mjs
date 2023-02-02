import fiosdkLib from '@fioprotocol/fiosdk';
import entities from '@fioprotocol/fiosdk/lib/entities/EndPoint';
import fetch from 'node-fetch';
import { Transactions } from '@fioprotocol/fiosdk/lib/transactions/Transactions';
import { Constants } from '@fioprotocol/fiosdk/lib/utils/constants';

import { FioApiUrl, Var } from '../models';

import {
  DAY_MS,
  FIO_ACTIONS,
  FIO_ACTIONS_TO_END_POINT_KEYS,
  FIO_ADDRESS_DELIMITER,
  DEFAULT_BUNDLE_SET_VALUE,
} from '../config/constants.js';

import MathOp from '../services/math.mjs';
import logger from '../logger.mjs';

export const FIOSDK = fiosdkLib.FIOSDK;
export const DEFAULT_ACTION_FEE_AMOUNT = new MathOp(FIOSDK.SUFUnit).mul(1500).toNumber();
export const INSUFFICIENT_FUNDS_ERR_MESSAGE = 'Insufficient funds to cover fee';
export const INSUFFICIENT_BALANCE = 'Insufficient balance';
export const FEES_VAR_KEY = 'FIO_FEES';
export const FEES_UPDATE_TIMEOUT_SEC = 1000 * 60 * 5; // 5 min
export const ABIS_VAR_KEY = 'FIO_RAW_ABIS';
export const ABIS_UPDATE_TIMEOUT_SEC = DAY_MS;
const TRANSACTION_DEFAULT_OFFSET_EXPIRATION = 2700; // 45 min
const EndPoint = entities.EndPoint;

const FIO_ACTION_NAMES = {
  [FIO_ACTIONS.registerFioAddress]: 'regaddress',
  [FIO_ACTIONS.registerFioDomain]: 'regdomain',
  [FIO_ACTIONS.renewFioDomain]: 'renewdomain',
  [FIO_ACTIONS.setFioDomainVisibility]: 'setdomainpub',
  [FIO_ACTIONS.transferFioAddress]: 'xferaddress',
  [FIO_ACTIONS.transferFioDomain]: 'xferdomain',
  [FIO_ACTIONS.addPublicAddress]: 'addaddress',
  [FIO_ACTIONS.removePublicAddresses]: 'remaddress',
  [FIO_ACTIONS.removeAllPublicAddresses]: 'remalladdr',
  [FIO_ACTIONS.requestFunds]: 'newfundsreq',
  [FIO_ACTIONS.recordObtData]: 'recordobt',
  [FIO_ACTIONS.rejectFundsRequest]: 'rejectfndreq',
  [FIO_ACTIONS.transferTokens]: 'trnsfiopubky',
  [FIO_ACTIONS.addBundledTransactions]: 'addbundles',
};

const FIO_ACCOUNT_NAMES = {
  [FIO_ACTIONS.transferTokens]: 'fio.token',
};

class Fio {
  async getPublicFioSDK() {
    if (!this.publicFioSDK) {
      const apiUrls = await FioApiUrl.getApiUrls();
      this.publicFioSDK = new FIOSDK('', '', apiUrls, fetch);
    }
    return this.publicFioSDK;
  }

  async getMasterFioSDK() {
    if (!this.masterFioSDK) {
      const { publicKey: masterPubKey } = FIOSDK.derivedPublicKey(
        process.env.MASTER_FIOSDK_KEY,
      );
      const apiUrls = await FioApiUrl.getApiUrls();
      this.masterFioSDK = new FIOSDK(
        process.env.MASTER_FIOSDK_KEY,
        masterPubKey,
        apiUrls,
        fetch,
        '',
        '',
        true,
      );
    }
    return this.masterFioSDK;
  }

  async getWalletSdkInstance(publicKey) {
    const apiUrls = await FioApiUrl.getApiUrls();
    return new FIOSDK('', publicKey, apiUrls, fetch);
  }

  sufToAmount(suf = 0) {
    return FIOSDK.SUFToAmount(suf);
  }

  amountToSUF(amount) {
    if (!amount) return 0;
    const floor = Math.floor(amount);
    const tempResult = new MathOp(floor).mul(FIOSDK.SUFUnit).toNumber();

    // get remainder
    const remainder = new MathOp(amount)
      .mod(1)
      .round(9, 2)
      .toNumber();

    const remainderResult = new MathOp(remainder).mul(FIOSDK.SUFUnit).toNumber();
    const floorRemainder = Math.floor(remainderResult);

    // add integer and remainder
    return new MathOp(tempResult).add(floorRemainder).toNumber();
  }

  convertFioToUsdc(nativeAmount, roe) {
    if (roe == null) return 0;

    return new MathOp(this.sufToAmount(nativeAmount))
      .mul(roe)
      .round(2, 1)
      .toNumber();
  }

  convertUsdcToFio(amount, roe) {
    if (roe == null || !roe) throw new Error('INVALID_ROE');

    return new MathOp(amount)
      .div(roe)
      .round(9, 2)
      .toNumber();
  }

  setFioName(address, domain) {
    return address ? `${address}${FIO_ADDRESS_DELIMITER}${domain}` : domain;
  }

  logError(e) {
    if (e.errorCode !== 404) logger.error(e.message);
    if (e.json) {
      logger.error(e.json);
    }
  }

  async registrationFee(forDomain = false) {
    const publicFioSDK = await this.getPublicFioSDK();

    const { fee } = await publicFioSDK.getFee(
      forDomain ? EndPoint.registerFioDomain : EndPoint.registerFioAddress,
    );
    return fee;
  }

  async getRawAbi() {
    const abisVar = await Var.getByKey(ABIS_VAR_KEY);
    if (abisVar && !Var.updateRequired(abisVar.updatedAt, ABIS_UPDATE_TIMEOUT_SEC)) {
      const abis = JSON.parse(abisVar.value);

      for (const accountName of Constants.rawAbiAccountName) {
        if (!Transactions.abiMap.get(accountName) && abis[accountName]) {
          Transactions.abiMap.set(abis[accountName].name, abis[accountName].response);
        }
      }

      return;
    }

    const fioPublicSdk = await fioApi.getPublicFioSDK();
    const abisObj = {};
    for (const accountName of Constants.rawAbiAccountName) {
      if (!Transactions.abiMap.get(accountName)) {
        try {
          const abiResponse = await fioPublicSdk.getAbi(accountName);
          Transactions.abiMap.set(abiResponse.account_name, abiResponse);
          abisObj[accountName] = {
            name: abiResponse.account_name,
            response: abiResponse,
          };
        } catch (e) {
          logger.error('Raw Abi Error:', e);
        }
      }
    }
    await Var.setValue(ABIS_VAR_KEY, JSON.stringify(abisObj));
  }

  getActionParams(options) {
    let actionParams = { tpid: options.tpid || process.env.DEFAULT_TPID };
    if (options.fee) actionParams.max_fee = options.fee;

    switch (options.action) {
      case FIO_ACTIONS.registerFioAddress: {
        actionParams = {
          ...actionParams,
          fio_address: `${options.address}${FIO_ADDRESS_DELIMITER}${options.domain}`,
          owner_fio_public_key: options.publicKey,
          expirationOffset: TRANSACTION_DEFAULT_OFFSET_EXPIRATION,
        };
        break;
      }
      case FIO_ACTIONS.registerFioDomain: {
        actionParams = {
          ...actionParams,
          fio_domain: options.domain,
          owner_fio_public_key: options.publicKey,
        };
        break;
      }
      case FIO_ACTIONS.transferTokens: {
        actionParams = {
          ...actionParams,
          payee_public_key: options.publicKey,
          amount: options.amount,
        };
        break;
      }
      case FIO_ACTIONS.renewFioDomain: {
        actionParams = {
          ...actionParams,
          fio_domain: options.domain,
        };
        break;
      }
      case FIO_ACTIONS.addBundledTransactions: {
        actionParams = {
          ...actionParams,
          fio_address: `${options.address}${FIO_ADDRESS_DELIMITER}${options.domain}`,
          bundle_sets: DEFAULT_BUNDLE_SET_VALUE,
        };
        break;
      }
      default:
      //
    }

    return { ...actionParams, ...options.params };
  }

  async getFee(action) {
    try {
      const publicFioSDK = await this.getPublicFioSDK();

      const { fee } = await publicFioSDK.getFee(
        EndPoint[FIO_ACTIONS_TO_END_POINT_KEYS[action]],
      );

      return fee;
    } catch (e) {
      this.logError(e);
    }

    return null;
  }

  async executeAction(action, params, auth = {}, keys = {}) {
    if (keys.private) {
      // todo: set new sdk and use it
    }

    if (
      !params.max_fee ||
      (params.max_fee && new MathOp(params.max_fee).lt(DEFAULT_ACTION_FEE_AMOUNT))
    )
      params.max_fee = DEFAULT_ACTION_FEE_AMOUNT;

    try {
      if (auth.actor) {
        params.actor = auth.actor;
        params.permission = auth.permission;
      }
      const fioSdk = await this.getMasterFioSDK();
      const preparedTrx = await fioSdk.pushTransaction(
        FIO_ACCOUNT_NAMES[action] || '',
        FIO_ACTION_NAMES[action],
        params,
      );
      const result = await fioSdk.executePreparedTrx(
        EndPoint[FIO_ACTIONS_TO_END_POINT_KEYS[action]],
        preparedTrx,
      );

      return result;
    } catch (err) {
      this.logError(err);

      let errorObj = {
        message: err.message,
      };

      if (err.json) {
        errorObj = { ...errorObj, ...err.json };
      }

      return errorObj;
    }
  }

  async executeTx(action, signedTx) {
    try {
      const fioSdk = await this.getMasterFioSDK();
      const result = await fioSdk.executePreparedTrx(
        EndPoint[FIO_ACTIONS_TO_END_POINT_KEYS[action]],
        signedTx,
      );

      return result;
    } catch (err) {
      this.logError(err);

      let errorObj = {
        message: err.message,
      };

      if (err.json) {
        errorObj = { ...errorObj, ...err.json };
      }

      return errorObj;
    }
  }

  checkTxError(tx) {
    const fieldError = Array.isArray(tx.fields) ? tx.fields.find(f => f.error) : null;

    const notes = fieldError ? fieldError.error : JSON.stringify(tx);

    return { notes, code: tx.code, data: tx.data };
  }
}

export const fioApi = new Fio();
