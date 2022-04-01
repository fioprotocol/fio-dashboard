import fiosdkLib from '@fioprotocol/fiosdk';
import entities from '@fioprotocol/fiosdk/lib/entities/EndPoint';
import fetch from 'node-fetch';

import MathOp from '../services/math.mjs';

export const FIOSDK = fiosdkLib.FIOSDK;
const EndPoint = entities.EndPoint;

class Fio {
  constructor() {
    this.publicFioSDK = new FIOSDK('', '', process.env.FIO_BASE_URL, fetch);
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
    const { fee } = await this.publicFioSDK.getFee(
      forDomain ? EndPoint.registerFioDomain : EndPoint.registerFioAddress,
    );
    return fee;
  }
}

export const fioApi = new Fio();
