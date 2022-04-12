import apis from '../../../../api';

export const validate = async (values: {
  transferAddress: string;
}): Promise<boolean> => {
  let { transferAddress } = values;

  if (!transferAddress) {
    throw new Error('Required');
  }

  let isFioAddress = false;
  let isValid = false;

  try {
    apis.fio.isFioAddressValid(transferAddress);
    isFioAddress = true;
  } catch (e) {
    //
  }

  if (isFioAddress) {
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

  throw new Error(
    'Unfortunately that FIO Crypto Handle or FIO Public Key is incorrect',
  );
};
