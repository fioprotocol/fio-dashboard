import { SendTokensValues } from '../../types';
import apis from '../../../../api';

export const validate = async (values: SendTokensValues) => {
  let transferToAddress = values.to;
  if (!transferToAddress) {
    return { to: 'Receiver is required' };
  }

  let isFioAddress = false;
  try {
    apis.fio.isFioAddressValid(transferToAddress);
    isFioAddress = true;
  } catch (e) {
    //
  }

  if (isFioAddress) {
    try {
      const {
        public_address: publicAddress,
      } = await apis.fio.getFioPublicAddress(transferToAddress);
      transferToAddress = publicAddress;
    } catch (e) {
      //
    }
  }

  try {
    apis.fio.isFioPublicKeyValid(transferToAddress);
    await apis.fio.publicFioSDK.getFioBalance(transferToAddress);
  } catch (e) {
    if (e.json && e.json.type === 'invalid_input') {
      return { to: 'Receiver is not valid' };
    }
    if (!e.json) {
      return { to: 'Receiver is not valid' };
    }
  }

  if (transferToAddress === values.fromPubKey) {
    return { to: 'Spend to self' };
  }

  if (!values.amount) {
    return { amount: 'Amount is required' };
  }

  return {};
};
