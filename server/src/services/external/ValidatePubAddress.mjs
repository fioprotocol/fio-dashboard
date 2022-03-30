import Web3 from 'web3';
import { validate } from 'bitcoin-address-validation';

import logger from '../../logger';
import Base from '../Base';

const ETH_API_URL = 'https://mainnet.infura.io/v3';
const CHAIN_CODES = {
  BTC: 'BTC',
  ETH: 'ETH',
};

export default class ValidatePubAddress extends Base {
  static get validationRules() {
    return {
      pubAddress: ['required', 'string'],
      chainCode: ['required', 'string'],
    };
  }

  async execute({ pubAddress, chainCode }) {
    try {
      // ETH
      if (chainCode === CHAIN_CODES.ETH) {
        const web3 = new Web3(ETH_API_URL);
        web3.utils.toChecksumAddress(pubAddress);

        return {
          data: { isValid: true },
        };
      }

      // BTC
      if (chainCode === CHAIN_CODES.BTC) {
        return {
          data: { isValid: validate(pubAddress) },
        };
      }

      throw new Error('No validation provided for chainCode - ' + chainCode);
    } catch (error) {
      logger.error(`Register error: ${error}`);
      return {
        data: { isValid: false, error },
      };
    }
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
