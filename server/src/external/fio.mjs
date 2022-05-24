import fiosdkLib from '@fioprotocol/fiosdk';
import entities from '@fioprotocol/fiosdk/lib/entities/EndPoint';
import fetch from 'node-fetch';
import { Transactions } from '@fioprotocol/fiosdk/lib/transactions/Transactions';
import { Constants } from '@fioprotocol/fiosdk/lib/utils/constants';

import logger from '../logger.mjs';

import { FIO_ACTIONS, FIO_ACTIONS_TO_END_POINT_KEYS } from '../config/constants.js';

import MathOp from '../services/math.mjs';
import logger from '../logger.mjs';

export const FIOSDK = fiosdkLib.FIOSDK;
export const DEFAULT_ACTION_FEE_AMOUNT = new MathOp(FIOSDK.SUFUnit).mul(800).toNumber();
export const INSUFFICIENT_FUNDS_ERR_MESSAGE = 'Insufficient funds to cover fee';
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

class Fio {
  getPublicFioSDK() {
    if (!this.publicFioSDK) {
      this.publicFioSDK = new FIOSDK('', '', process.env.FIO_BASE_URL, fetch);
    }
    return this.publicFioSDK;
  }

  getMasterFioSDK() {
    if (!this.masterFioSDK) {
      const { publicKey: masterPubKey } = FIOSDK.derivedPublicKey(
        process.env.MASTER_FIOSDK_KEY,
      );
      this.masterFioSDK = new FIOSDK(
        process.env.MASTER_FIOSDK_KEY,
        masterPubKey,
        process.env.FIO_BASE_URL,
        fetch,
        '',
        '',
        true,
      );
    }
    return this.masterFioSDK;
  }

  getWalletSdkInstance(publicKey) {
    return new FIOSDK('', publicKey, process.env.FIO_BASE_URL, fetch);
  }

  sufToAmount(suf = 0) {
    return FIOSDK.SUFToAmount(suf);
  }

  convertFioToUsdc(nativeAmount, roe) {
    return new MathOp(this.sufToAmount(nativeAmount))
      .mul(roe)
      .round(2, 1)
      .toNumber();
  }

  async registrationFee(forDomain = false) {
    const publicFioSDK = this.getPublicFioSDK();

    const { fee } = await publicFioSDK.getFee(
      forDomain ? EndPoint.registerFioDomain : EndPoint.registerFioAddress,
    );
    return fee;
  }

  async getRawAbi() {
    const fioPublicSdk = fioApi.getPublicFioSDK();
    for (const accountName of Constants.rawAbiAccountName) {
      if (!Transactions.abiMap.get(accountName)) {
        try {
          const abiResponse = await fioPublicSdk.getAbi(accountName);
          Transactions.abiMap.set(abiResponse.account_name, abiResponse);
        } catch (e) {
          logger.error('Raw Abi Error:', e);
        }
      }
    }
  }

  async executeAction(action, params, auth, keys = {}) {
    if (keys.private) {
      // todo: set new sdk and use it
    }

    if (!params.maxFee) params.maxFee = DEFAULT_ACTION_FEE_AMOUNT;

    try {
      if (auth.actor) {
        params.actor = auth.actor;
        // todo: set permission, probably need to update fiosdk
      }
      const fioSdk = this.getMasterFioSDK()
      const preparedTrx = await fioSdk.pushTransaction(
        '',
        FIO_ACTION_NAMES[action],
        params,
      );
      const result = await fioSdk.executePreparedTrx(
        this.actionEndPoints[FIO_ACTIONS_TO_END_POINT_KEYS[action]],
        preparedTrx,
      );

      return result;
    } catch (err) {
      this.logError(err);
      throw err;
    }
  }
}

export const fioApi = new Fio();
