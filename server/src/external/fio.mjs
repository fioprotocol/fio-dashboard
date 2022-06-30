import fiosdkLib from '@fioprotocol/fiosdk';
import entities from '@fioprotocol/fiosdk/lib/entities/EndPoint';
import fetch from 'node-fetch';
import { Transactions } from '@fioprotocol/fiosdk/lib/transactions/Transactions';
import { Constants } from '@fioprotocol/fiosdk/lib/utils/constants';

import MathOp from '../services/math.mjs';
import logger from '../logger.mjs';

export const FIOSDK = fiosdkLib.FIOSDK;
const EndPoint = entities.EndPoint;

class Fio {
  getPublicFioSDK() {
    if (!this.publicFioSDK) {
      this.publicFioSDK = new FIOSDK('', '', process.env.FIO_BASE_URL, fetch);
    }
    return this.publicFioSDK;
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
}

export const fioApi = new Fio();
