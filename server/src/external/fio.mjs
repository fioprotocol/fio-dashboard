import crypto from 'crypto';

import superagent from 'superagent';

import fetch from 'node-fetch';
import { Account, FIOSDK, fioConstants, GenericAction } from '@fioprotocol/fiosdk';

import { FioApiUrl } from '../models/FioApiUrl.mjs';
import { Var } from '../models/Var.mjs';

import {
  DAY_MS,
  FIO_ACTIONS_TO_END_POINT_MAP,
  FIO_ADDRESS_DELIMITER,
  DEFAULT_BUNDLE_SET_VALUE,
  MINUTE_MS,
} from '../config/constants.js';

import { FIO_API_URLS_TYPES, NON_VALID_FCH } from '../constants/fio.mjs';

import { isDomain } from '../utils/fio.mjs';
import MathOp from '../services/math.mjs';
import logger from '../logger.mjs';

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

export const FIO_ACTION_NAMES = {
  [GenericAction.registerFioAddress]: 'regaddress',
  [GenericAction.registerFioDomain]: 'regdomain',
  [GenericAction.registerFioDomainAddress]: 'regdomadd',
  [GenericAction.renewFioDomain]: 'renewdomain',
  [GenericAction.setFioDomainVisibility]: 'setdomainpub',
  [GenericAction.transferFioAddress]: 'xferaddress',
  [GenericAction.transferFioDomain]: 'xferdomain',
  [GenericAction.addPublicAddress]: 'addaddress',
  [GenericAction.removePublicAddresses]: 'remaddress',
  [GenericAction.removeAllPublicAddresses]: 'remalladdr',
  [GenericAction.requestFunds]: 'newfundsreq',
  [GenericAction.recordObtData]: 'recordobt',
  [GenericAction.rejectFundsRequest]: 'rejectfndreq',
  [GenericAction.transferTokens]: 'trnsfiopubky',
  [GenericAction.addBundledTransactions]: 'addbundles',
};

const FIO_ACCOUNT_NAMES = {
  [GenericAction.transferTokens]: 'fio.token',
};

const REQUIRED_PRICE_FIELDS_NAMES = {
  ADDRESS: 'address',
  DOMAIN: 'domain',
  COMBO: 'combo',
  ADD_BUNDLES: 'addBundles',
  RENEW_DOMAIN: 'renewDomain',
};

const PRICE_ACTIONS = {
  [REQUIRED_PRICE_FIELDS_NAMES.ADDRESS]: GenericAction.registerFioAddress,
  [REQUIRED_PRICE_FIELDS_NAMES.DOMAIN]: GenericAction.registerFioDomain,
  [REQUIRED_PRICE_FIELDS_NAMES.COMBO]: GenericAction.registerFioDomainAddress,
  [REQUIRED_PRICE_FIELDS_NAMES.RENEW_DOMAIN]: GenericAction.renewFioDomain,
  [REQUIRED_PRICE_FIELDS_NAMES.ADD_BUNDLES]: GenericAction.addBundledTransactions,
};

class Fio {
  async checkUrls(apiUrls) {
    const checkedUrls = [];
    const checkUrl = async (apiUrl, index) => {
      try {
        const response = await superagent.get(`${apiUrl}chain/get_info`);

        const { head_block_time } = response.body;
        if (new Date().getTime() - new Date(head_block_time + 'Z').getTime() < MINUTE_MS)
          checkedUrls[index] = apiUrl;
      } catch (err) {
        logger.error(err.message);
      }
    };
    await Promise.allSettled(apiUrls.map((url, i) => checkUrl(url, i)));

    if (checkedUrls.length === 0) throw new Error('No active valid api url is set.');

    const newSet = [];
    for (const url of checkedUrls) {
      if (url) newSet.push(url);
    }

    return newSet;
  }

  async getPublicFioSDK() {
    if (!this.publicFioSDK) {
      const apiUrls = await FioApiUrl.getApiUrls({
        type: FIO_API_URLS_TYPES.DASHBOARD_API,
      });
      this.publicFioSDK = new FIOSDK({
        apiUrls,
        fetchJson: fetch,
      });
    }
    return this.publicFioSDK;
  }

  getMasterPublicKey() {
    const { publicKey: masterPubKey } = FIOSDK.derivedPublicKey(
      process.env.MASTER_FIOSDK_KEY,
    );
    return masterPubKey;
  }

  async getMasterFioSDK() {
    if (!this.masterFioSDK) {
      const { publicKey: masterPubKey } = FIOSDK.derivedPublicKey(
        process.env.MASTER_FIOSDK_KEY,
      );
      const apiUrls = await FioApiUrl.getApiUrls({
        type: FIO_API_URLS_TYPES.DASHBOARD_API,
      });
      const validApiUrls = await this.checkUrls(apiUrls);
      this.masterFioSDK = new FIOSDK({
        privateKey: process.env.MASTER_FIOSDK_KEY,
        publicKey: masterPubKey,
        apiUrls: validApiUrls,
        fetchJson: fetch,
        returnPreparedTrx: true,
      });
    }
    return this.masterFioSDK;
  }

  async getWalletSdkInstance(publicKey) {
    const apiUrls = await FioApiUrl.getApiUrls({
      type: FIO_API_URLS_TYPES.DASHBOARD_API,
    });
    const validApiUrls = await this.checkUrls(apiUrls);
    return new FIOSDK({
      publicKey,
      apiUrls: validApiUrls,
      fetchJson: fetch,
    });
  }

  amountToSUF(amount) {
    if (!amount) return 0;
    const floor = Math.floor(amount); // todo: change to use MathOp
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

  SUFToAmount(suf) {
    return new MathOp(suf).div(FIOSDK.SUFUnit).toString();
  }

  convertFioToUsdc(nativeAmount, roe) {
    if (roe == null) return 0;

    // todo: create SUFToAmount using MathOp
    return new MathOp(FIOSDK.SUFToAmount(nativeAmount || 0))
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

      for (const accountName of fioConstants.rawAbiAccountName) {
        if (!FIOSDK.abiMap.get(accountName) && abis[accountName]) {
          FIOSDK.abiMap.set(abis[accountName].name, abis[accountName].response);
        }
      }

      return;
    }

    const abisObj = {};
    for (const accountName of fioConstants.rawAbiAccountName) {
      try {
        const fioPublicSdk = await fioApi.getPublicFioSDK();

        if (!FIOSDK.abiMap.get(accountName)) {
          const abiResponse = await fioPublicSdk.getAbi(accountName);
          FIOSDK.abiMap.set(abiResponse.account_name, abiResponse);
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
      case GenericAction.registerFioAddress: {
        actionParams = {
          ...actionParams,
          fio_address: `${options.address}${FIO_ADDRESS_DELIMITER}${options.domain}`,
          owner_fio_public_key: options.publicKey,
          expirationOffset: TRANSACTION_DEFAULT_OFFSET_EXPIRATION,
        };
        break;
      }
      case GenericAction.registerFioDomain: {
        actionParams = {
          ...actionParams,
          fio_domain: options.domain,
          owner_fio_public_key: options.publicKey,
        };
        break;
      }
      case GenericAction.registerFioDomainAddress: {
        actionParams = {
          ...actionParams,
          fio_address: `${options.address}${FIO_ADDRESS_DELIMITER}${options.domain}`,
          owner_fio_public_key: options.publicKey,
          expirationOffset: TRANSACTION_DEFAULT_OFFSET_EXPIRATION,
          is_public: options.isPublic || 0,
        };
        break;
      }
      case GenericAction.transferTokens: {
        actionParams = {
          ...actionParams,
          payee_public_key: options.publicKey,
          amount: options.amount,
        };
        break;
      }
      case GenericAction.renewFioDomain: {
        actionParams = {
          ...actionParams,
          fio_domain: options.domain,
        };
        break;
      }
      case GenericAction.addBundledTransactions: {
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
    const publicFioSDK = await this.getPublicFioSDK();

    const { fee } = await publicFioSDK.getFee({
      endPoint: FIO_ACTIONS_TO_END_POINT_MAP[action],
    });

    return fee;
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
      logger.info('PARAMS', params);
      logger.info('account', FIO_ACCOUNT_NAMES[action]);
      logger.info('action', FIO_ACTION_NAMES[action]);
      logger.info('auth.permission', auth.permission);
      const preparedTrx = await fioSdk.pushTransaction({
        account: FIO_ACCOUNT_NAMES[action] || '',
        action: FIO_ACTION_NAMES[action],
        data: params,
        authPermission: auth.permission,
      });
      logger.info(
        'FIO_ACTIONS_TO_END_POINT_MAP[action]',
        FIO_ACTIONS_TO_END_POINT_MAP[action],
      );
      return await fioSdk.executePreparedTrx(
        FIO_ACTIONS_TO_END_POINT_MAP[action],
        preparedTrx,
      );
    } catch (err) {
      this.logError('EXECUTE ACTION ERROR', err);

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
        FIO_ACTIONS_TO_END_POINT_MAP[action],
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

  async getPrices(forceRefresh = false, onlyReturnActual = false) {
    let prices;

    const pricesVar = await Var.getByKey(PRICES_VAR_KEY);
    const dataBasePrices = pricesVar.value ? JSON.parse(pricesVar.value) : null;

    if (!forceRefresh && !onlyReturnActual) {
      if (
        pricesVar &&
        !Var.updateRequired(pricesVar.updatedAt, FEES_UPDATE_TIMEOUT_SEC)
      ) {
        try {
          prices = dataBasePrices;
          // eslint-disable-next-line no-empty
        } catch (e) {}
      }
    }

    try {
      if (
        !prices ||
        (prices &&
          Object.values(REQUIRED_PRICE_FIELDS_NAMES).some(field => !prices[field]))
      ) {
        const priceResults = await Promise.allSettled(
          Object.entries(PRICE_ACTIONS).map(async ([key, action]) =>
            this.getFee(action)
              .then(fee => ({ fee, key }))
              .catch(error =>
                Promise.reject({
                  message: error.message || 'Unknown error',
                  stack: error.stack,
                  ...error,
                  key,
                }),
              ),
          ),
        );

        logger.info(
          `SUCCESS PRICES FROM FIO SERVER: ${priceResults
            .filter(({ status }) => status === 'fulfilled')
            .map(({ value }) => ` ${value.key}: ${value.fee}`)}`,
        );

        if (priceResults.some(({ status }) => status === 'rejected')) {
          logger.info(
            `FAILED PRICES FROM FIO SERVER ${priceResults
              .filter(({ status }) => status === 'rejected')
              .map(({ reason: { key, message } }) => ` ${key}: ${message}`)}`,
          );
        }

        const processedPricesResults = priceResults.map(
          ({ status, value: { fee, key } = {}, reason: { key: reasonKey } = {} }) => {
            if (status === 'fulfilled') {
              if (fee)
                return {
                  fee,
                  key,
                };

              if (!fee && dataBasePrices && dataBasePrices[key]) {
                logger.info(
                  `FEE for ${key} is absent set fallback price to: ${dataBasePrices[key]}`,
                );
                return {
                  fee: dataBasePrices[key],
                  key,
                };
              }

              throw new Error(
                `Failed to get price for ${key} action and no fallback available.`,
              );
            }

            if (status === 'rejected') {
              if (dataBasePrices && dataBasePrices[reasonKey]) {
                logger.info(
                  `Get FEE for ${reasonKey} has an error set fallback price to: ${dataBasePrices[reasonKey]}`,
                );
                return {
                  fee: dataBasePrices[reasonKey],
                  key: reasonKey,
                };
              }

              throw new Error(
                `Failed to set fallback price for errored ${reasonKey} action.`,
              );
            }
          },
        );

        prices = processedPricesResults.reduce(
          (acc, { fee, key }) => ({ ...acc, [key]: fee }),
          {},
        );

        if (!onlyReturnActual) await Var.setValue(PRICES_VAR_KEY, JSON.stringify(prices));
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
    const res = await publicFioSDK.getFioPublicAddress({ fioAddress });
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
      code: Account.address,
      scope: Account.address,
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
        code: Account.address,
        scope: Account.address,
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

  async validateFioAddress(address, domain) {
    const publicFioSDK = await this.getPublicFioSDK();

    if (
      address.length > 36 ||
      address.length + domain.length > 63 ||
      !publicFioSDK.validateFioAddress(`${address}${FIO_ADDRESS_DELIMITER}${domain}`)
    ) {
      this.logError({
        message: NON_VALID_FCH,
        address,
        domain,
      });

      return false;
    }

    return true;
  }
}

export const fioApi = new Fio();
