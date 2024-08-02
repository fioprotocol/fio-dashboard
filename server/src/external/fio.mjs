import crypto from 'crypto';

import superagent from 'superagent';

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

import { FIO_API_URLS_TYPES } from '../constants/fio.mjs';

import { isDomain } from '../utils/fio.mjs';
import MathOp from '../services/math.mjs';
import logger from '../logger.mjs';

export const FIOSDK = fiosdkLib.FIOSDK;
export const DEFAULT_ACTION_FEE_AMOUNT = new MathOp(FIOSDK.SUFUnit).mul(1500).toNumber();
export const INSUFFICIENT_FUNDS_ERR_MESSAGE = 'Insufficient funds to cover fee';
export const INSUFFICIENT_BALANCE = 'Insufficient balance';
export const PRICES_VAR_KEY = 'FIO_PRICES';
export const FEES_VAR_KEY = 'FIO_FEES';
export const FEES_UPDATE_TIMEOUT_SEC = 1000 * 60 * 5; // 5 min
export const ABIS_VAR_KEY = 'FIO_RAW_ABIS';
export const ABIS_UPDATE_TIMEOUT_SEC = DAY_MS;
const DEFAULT_MAX_FEE_MULTIPLE_AMOUNT = 1.25;
const TRANSACTION_DEFAULT_OFFSET_EXPIRATION = 2700; // 45 min
const EndPoint = entities.EndPoint;

const FIO_ACTION_NAMES = {
  [FIO_ACTIONS.registerFioAddress]: 'regaddress',
  [FIO_ACTIONS.registerFioDomain]: 'regdomain',
  [FIO_ACTIONS.registerFioDomainAddress]: 'regdomadd',
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
      const apiUrls = await FioApiUrl.getApiUrls({
        type: FIO_API_URLS_TYPES.DASHBOARD_API,
      });
      this.publicFioSDK = new FIOSDK('', '', apiUrls, fetch);
    }
    return this.publicFioSDK;
  }

  async getMasterFioSDK() {
    if (!this.masterFioSDK) {
      const { publicKey: masterPubKey } = FIOSDK.derivedPublicKey(
        process.env.MASTER_FIOSDK_KEY,
      );
      const apiUrls = await FioApiUrl.getApiUrls({
        type: FIO_API_URLS_TYPES.DASHBOARD_API,
      });
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
    const apiUrls = await FioApiUrl.getApiUrls({
      type: FIO_API_URLS_TYPES.DASHBOARD_API,
    });
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

    const abisObj = {};
    for (const accountName of Constants.rawAbiAccountName) {
      try {
        const fioPublicSdk = await fioApi.getPublicFioSDK();

        if (!Transactions.abiMap.get(accountName)) {
          const abiResponse = await fioPublicSdk.getAbi(accountName);
          Transactions.abiMap.set(abiResponse.account_name, abiResponse);
          abisObj[accountName] = {
            name: abiResponse.account_name,
            response: abiResponse,
          };
        }
      } catch (e) {
        logger.error('Raw Abi Error:', e);
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
      case FIO_ACTIONS.registerFioDomainAddress: {
        actionParams = {
          ...actionParams,
          fio_address: `${options.address}${FIO_ADDRESS_DELIMITER}${options.domain}`,
          owner_fio_public_key: options.publicKey,
          expirationOffset: TRANSACTION_DEFAULT_OFFSET_EXPIRATION,
          is_public: options.isPublic || 0,
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
      this.logError('Get fee error', e);
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

    params.max_fee = new MathOp(params.max_fee)
      .mul(DEFAULT_MAX_FEE_MULTIPLE_AMOUNT)
      .round(0)
      .toNumber();

    try {
      if (auth.actor) {
        params.actor = auth.actor;
        params.permission = auth.permission;
      }
      const fioSdk = await this.getMasterFioSDK();

      const preparedTrx = await fioSdk.pushTransaction({
        account: FIO_ACCOUNT_NAMES[action] || '',
        action: FIO_ACTION_NAMES[action],
        data: params,
        authPermission: auth.permission,
      });

      return await fioSdk.executePreparedTrx(
        EndPoint[FIO_ACTIONS_TO_END_POINT_KEYS[action]],
        preparedTrx,
      );
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
      return await fioSdk.executePreparedTrx(
        EndPoint[FIO_ACTIONS_TO_END_POINT_KEYS[action]],
        signedTx,
      );
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

  async getPrices(forceRefresh = false) {
    let prices;
    if (!forceRefresh) {
      const pricesVar = await Var.getByKey(PRICES_VAR_KEY);
      if (
        pricesVar &&
        !Var.updateRequired(pricesVar.updatedAt, FEES_UPDATE_TIMEOUT_SEC)
      ) {
        try {
          prices = JSON.parse(pricesVar.value);
          // eslint-disable-next-line no-empty
        } catch (e) {}
      }
    }
    try {
      if (
        !prices ||
        !prices.renewDomain ||
        !prices.addBundles ||
        !prices.address ||
        !prices.domain ||
        !prices.combo
      ) {
        const [
          registrationAddressFee,
          registrationDomainFee,
          registerDomainAddress,
          renewDomainFee,
          addBundlesFee,
        ] = await Promise.all([
          this.getFee(FIO_ACTIONS.registerFioAddress),
          this.getFee(FIO_ACTIONS.registerFioDomain),
          this.getFee(FIO_ACTIONS.registerFioDomainAddress),
          this.getFee(FIO_ACTIONS.renewFioDomain),
          this.getFee(FIO_ACTIONS.addBundledTransactions),
        ]);

        prices = {
          address: registrationAddressFee,
          domain: registrationDomainFee,
          combo: registerDomainAddress,
          renewDomain: renewDomainFee,
          addBundles: addBundlesFee,
        };

        await Var.setValue(PRICES_VAR_KEY, JSON.stringify(prices));
      }
    } catch (e) {
      logger.error('Get Prices Error: ', e);
    }

    return prices;
  }

  async checkFioChainEnvironment() {
    const publicFioSDK = await this.getPublicFioSDK();
    const chainId = await publicFioSDK.transactions.getChainInfo();

    if (!chainId) throw new Error('Missing FIO chain environment');
    if (chainId.chain_id !== process.env.FIO_CHAIN_ID)
      throw new Error(
        `Mismatch of preferred FIO chain: ${process.env.FIO_CHAIN_ID} and Public FIO SDK chain: ${chainId.chain_id}`,
      );
  }

  async getActor(publicKey) {
    const publicFioSDK = await this.getPublicFioSDK();
    return publicFioSDK.transactions.getActor(publicKey);
  }

  async getPublicAddressByFioAddress(fioAddress) {
    const publicFioSDK = await this.getPublicFioSDK();
    const res = await publicFioSDK.getFioPublicAddress(fioAddress);
    return res.public_address;
  }

  async getTableRows({ params, apiUrlType }) {
    const apiUrls = await FioApiUrl.getApiUrls({
      type: apiUrlType,
    });

    const getTableRowsRequest = async ({ params, url }) => {
      const response = await superagent.post(url).send(params);

      const { rows, more } = response.body;

      return { rows, more };
    };

    for (let i = 0; i < apiUrls.length; i++) {
      const url = `${apiUrls[i]}chain/get_table_rows`;

      try {
        return await getTableRowsRequest({ params, url });
      } catch (err) {
        this.logError(err);
        // If this was the last URL, throw the error
        if (i === apiUrls.length - 1) {
          throw err;
        }
      }
    }
  }

  setTableRowsParams(fioName) {
    const hash = crypto.createHash('sha1');
    const bound =
      '0x' +
      hash
        .update(fioName)
        .digest()
        .slice(0, 16)
        .reverse()
        .toString('hex');

    const params = {
      code: 'fio.address',
      scope: 'fio.address',
      table: 'fionames',
      lower_bound: bound,
      upper_bound: bound,
      key_type: 'i128',
      index_position: '5',
      json: true,
    };
    if (isDomain(fioName)) {
      params.table = 'domains';
      params.index_position = '4';
    }

    return params;
  }

  async getPublicAddressByAccount(account) {
    const { rows } = await this.getTableRows({
      params: {
        code: 'fio.address',
        scope: 'fio.address',
        table: 'accountmap',
        lower_bound: account,
        upper_bound: account,
        key_type: 'name',
        index_position: '1',
        json: true,
      },
      apiUrlType: FIO_API_URLS_TYPES.DASHBOARD_API,
    });

    if (rows && rows.length) {
      return rows[0].clientkey;
    }
  }

  async getFioDomain(domainName) {
    try {
      const tableRowsParams = this.setTableRowsParams(domainName);

      const { rows } = await this.getTableRows({
        params: tableRowsParams,
        apiUrlType: FIO_API_URLS_TYPES.DASHBOARD_API,
      });

      return rows.length ? rows[0] : null;
    } catch (e) {
      this.logError(e);
    }
  }

  async getFioAddress(addressName) {
    try {
      const tableRowsParams = this.setTableRowsParams(addressName);

      const { rows } = await this.getTableRows({
        params: tableRowsParams,
        apiUrlType: FIO_API_URLS_TYPES.DASHBOARD_API,
      });

      return rows.length ? rows[0] : null;
    } catch (e) {
      this.logError(e);
    }
  }

  async isAccountCouldBeRenewed(address) {
    const isDomain = address.indexOf(FIO_ADDRESS_DELIMITER) === -1;

    const data = isDomain
      ? await this.getFioDomain(address)
      : await this.getFioAddress(address);

    return !!data;
  }
}

export const fioApi = new Fio();
