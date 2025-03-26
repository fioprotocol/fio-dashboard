import { FIOSDK } from '@fioprotocol/fiosdk';

const validationSdk = new FIOSDK();

export default {
  token() {
    return function(value) {
      if (value === undefined || value === null || value === '') return;
      if (value.indexOf('Bearer ') !== 0) return 'NOT_VALID_TOKEN';

      const jwtToken = value.replace('Bearer ', '').trim();
      if (!jwtToken) return 'NOT_VALID_TOKEN';
    };
  },
  fio_public_key() {
    return function(value) {
      if (value === undefined || value === null || value === '') return;
      if (!validationSdk.validateFioPublicKey(value)) return 'NOT_VALID_FIO_PUBLIC_KEY';
    };
  },
  edge_wallet_id() {
    return function(value) {
      if (value === undefined || value === null || value === '') return;

      try {
        const decoded = Buffer.from(value, 'base64');
        // HMAC-SHA256 produces 32 bytes (256 bits)
        if (decoded.length !== 32) {
          return 'NOT_VALID_EDGE_WALLET_ID';
        }
      } catch (error) {
        return 'NOT_VALID_EDGE_WALLET_ID';
      }
    };
  },
};
