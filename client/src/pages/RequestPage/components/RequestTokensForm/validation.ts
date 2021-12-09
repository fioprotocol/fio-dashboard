import { FIORequestFormValues } from '../../types';
import apis from '../../../../api';

export const validate = async (values: FIORequestFormValues) => {
  let requestToAddress = values.fioAddressRequestTo;
  if (!requestToAddress) {
    return { fioAddressFrom: 'Requested is required' };
  }

  let isFioAddress = false;
  try {
    apis.fio.isFioAddressValid(requestToAddress);
    isFioAddress = true;
  } catch (e) {
    //
  }

  if (isFioAddress) {
    try {
      const {
        public_address: publicAddress,
      } = await apis.fio.getFioPublicAddress(requestToAddress);
      requestToAddress = publicAddress;
    } catch (e) {
      //
    }
  }

  try {
    apis.fio.isFioPublicKeyValid(requestToAddress);
    await apis.fio.publicFioSDK.getFioBalance(requestToAddress);
  } catch (e) {
    if (e.json && e.json.type === 'invalid_input') {
      return { fioAddressRequestTo: 'Requested is not valid' };
    }
    if (!e.json) {
      return { fioAddressRequestTo: 'Requested is not valid' };
    }
  }

  if (requestToAddress === values.fioAddressRequestFrom) {
    return { fioAddressRequestTo: 'Request other instead to self' };
  }

  if (!values.requestAmount) {
    return { amount: 'Request amount is required' };
  }

  return {};
};
