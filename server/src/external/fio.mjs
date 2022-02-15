import fiosdkLib from '@fioprotocol/fiosdk';
import entities from '@fioprotocol/fiosdk/lib/entities/EndPoint';
import fetch from 'node-fetch';

export const FIOSDK = fiosdkLib.FIOSDK;
const EndPoint = entities.EndPoint;

class Fio {
  constructor() {
    this.publicFioSDK = new FIOSDK('', '', process.env.FIO_BASE_URL, fetch);
  }

  async registrationFee(forDomain = false) {
    const { fee } = await this.publicFioSDK.getFee(
      forDomain ? EndPoint.registerFioDomain : EndPoint.registerFioAddress,
    );
    return fee;
  }
}

export const fioApi = new Fio();
