import { Api } from '../../api';

export const prefix = 'nftSignatures';

export const FIO_SIGNATURE_ADDRESS_REQUEST = `${prefix}/FIO_SIGNATURE_ADDRESS_REQUEST`;
export const FIO_SIGNATURE_ADDRESS_SUCCESS = `${prefix}/FIO_SIGNATURE_ADDRESS_SUCCESS`;
export const FIO_SIGNATURE_ADDRESS_FAILURE = `${prefix}/FIO_SIGNATURE_ADDRESS_FAILURE`;

export const getSignaturesFromFioAddress = (publicKey: string) => ({
  types: [
    FIO_SIGNATURE_ADDRESS_REQUEST,
    FIO_SIGNATURE_ADDRESS_SUCCESS,
    FIO_SIGNATURE_ADDRESS_FAILURE,
  ],
  promise: (api: Api) => {
    return api.fio.getNFTsFioAddress(publicKey, 100, 0);
  },
  publicKey,
});
