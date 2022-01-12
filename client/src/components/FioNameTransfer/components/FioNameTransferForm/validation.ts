import apis from '../../../../api';

export const validate = async (values: { transferAddress: string }) => {
  let { transferAddress } = values;

  if (!transferAddress) {
    throw { transferAddress: 'Required' };
  }

  let isFioCryptoHandle = false;
  let isValid = false;

  try {
    apis.fio.isFioCryptoHandleValid(transferAddress);
    isFioCryptoHandle = true;
  } catch (e) {
    //
  }

  if (isFioCryptoHandle) {
    try {
      const {
        public_address: publicAddress,
      } = await apis.fio.getFioPublicAddress(transferAddress);
      transferAddress = publicAddress;
    } catch (e) {
      //
    }
  }

  try {
    apis.fio.isFioPublicKeyValid(transferAddress);
    await apis.fio.publicFioSDK.getFioBalance(transferAddress);
    isValid = true;
  } catch (e) {
    if (e.json && e.json.type !== 'invalid_input') {
      isValid = true;
    }
    //
  }

  if (isValid) return true;

  throw {
    transferAddress:
      'Unfortunately that FIO Crypto Handle or FIO Public Key is incorrect',
  };
};
