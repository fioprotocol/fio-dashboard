import { Api } from '../../api';
import { NftItem } from '@fioprotocol/fiosdk/src/entities/NftItem';

export const prefix = 'nftSignatures';

export const FIO_SIGNATURE_ADDRESS_REQUEST = `${prefix}/FIO_SIGNATURE_ADDRESS_REQUEST`;
export const FIO_SIGNATURE_ADDRESS_SUCCESS = `${prefix}/FIO_SIGNATURE_ADDRESS_SUCCESS`;
export const FIO_SIGNATURE_ADDRESS_FAILURE = `${prefix}/FIO_SIGNATURE_ADDRESS_FAILURE`;
export const FIO_SIGN_NFT_REQUEST = `${prefix}/FIO_SIGN_NFT_REQUEST`;
export const FIO_SIGN_NFT_SUCCESS = `${prefix}/FIO_SIGN_NFT_SUCCESS`;
export const FIO_SIGN_NFT_FAILURE = `${prefix}/FIO_SIGN_NFT_FAILURE`;

export const getSignaturesFromFioAddress = (publicKey: string) => ({
  types: [
    FIO_SIGNATURE_ADDRESS_REQUEST,
    FIO_SIGNATURE_ADDRESS_SUCCESS,
    FIO_SIGNATURE_ADDRESS_FAILURE,
  ],
  promise: (api: Api) => {
    return api.fio.getNFTsFioAddress(publicKey, 100, 0);
  },
});

export const singNFT = (publicKey: string, nfts: NftItem[]) => ({
  types: [FIO_SIGN_NFT_REQUEST, FIO_SIGN_NFT_SUCCESS, FIO_SIGN_NFT_FAILURE],
  promise: (api: Api) => {
    return api.fio.singNFT(publicKey, nfts);
  },
});
