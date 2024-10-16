import { FIOSDK } from '@fioprotocol/fiosdk';

import apis from '../../../../api';

export const validate = async (values: {
  transferAddress: string;
}): Promise<boolean> => {
  let { transferAddress } = values;

  if (!transferAddress) {
    throw new Error('Required');
  }

  if (apis.fio.publicFioSDK.validateFioAddress(transferAddress)) {
    try {
      const {
        public_address: publicAddress,
      } = await apis.fio.getFioPublicAddress(transferAddress);
      transferAddress = publicAddress;
    } catch (e) {
      //
    }
  }

  let isValid = false;

  try {
    FIOSDK.isFioPublicKeyValid(transferAddress);
    await apis.fio.publicFioSDK.getFioBalance({
      fioPublicKey: transferAddress,
    });
    isValid = true;
  } catch (e) {
    // TODO refactor validation
    if (e.json && e.json.type !== 'invalid_input') {
      isValid = true;
    }
    //
  }

  if (isValid) return true;

  throw new Error(
    'Unfortunately that FIO Handle or FIO Public Key is incorrect',
  );
};
