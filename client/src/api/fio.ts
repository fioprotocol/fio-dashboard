import { FIOSDK } from '@fioprotocol/fiosdk';
import { AvailabilityResponse } from '@fioprotocol/fiosdk/src/entities/AvailabilityResponse';
import { FioNamesResponse } from '@fioprotocol/fiosdk/src/entities/FioNamesResponse';
import { FioAddressesResponse } from '@fioprotocol/fiosdk/src/entities/FioAddressesResponse';
import { FioDomainsResponse } from '@fioprotocol/fiosdk/src/entities/FioDomainsResponse';
import { PublicAddressResponse } from '@fioprotocol/fiosdk/src/entities/PublicAddressResponse';
import { PublicAddressesResponse } from '@fioprotocol/fiosdk/src/entities/PublicAddressesResponse';
import { Transactions } from '@fioprotocol/fiosdk/lib/transactions/Transactions';
import { EndPoint } from '@fioprotocol/fiosdk/lib/entities/EndPoint';
import { isDomain } from '../utils';
import { NftsResponse } from '@fioprotocol/fiosdk/src/entities/NftsResponse';

import { ACTIONS, ACTIONS_TO_END_POINT_KEYS } from '../constants/fio';

import { NFTTokenDoublet, WalletKeys } from '../types';

export interface TrxResponse {
  transaction_id?: string;
  status: string;
  expiration?: string;
  fee_collected: number;
  other?: any;
}

type FIOSDK_LIB = typeof FIOSDK;

export const DEFAULT_ACTION_FEE_AMOUNT = 800 * FIOSDK.SUFUnit;

export default class Fio {
  baseurl: string = process.env.REACT_APP_FIO_BASE_URL;
  publicFioSDK: FIOSDK_LIB | null = null;
  walletFioSDK: FIOSDK_LIB | null = null;
  actionEndPoints: { [actionName: string]: string } = {
    ...EndPoint,
    [ACTIONS.addNft]: 'add_nft',
    [ACTIONS.pushTransaction]: 'push_transaction',
  };

  constructor() {
    this.publicFioSDK = new FIOSDK('', '', this.baseurl, window.fetch);
  }

  amountToSUF = (amount: number): number => FIOSDK.amountToSUF(amount);

  sufToAmount = (suf?: number): number | null => {
    if (!suf && suf !== 0) return null;
    return FIOSDK.SUFToAmount(suf);
  };

  setBaseUrl = (): string => (Transactions.baseUrl = this.baseurl);

  isFioAddressValid = (value: string): boolean =>
    FIOSDK.isFioAddressValid(value);
  isFioPublicKeyValid = (value: string): boolean =>
    FIOSDK.isFioPublicKeyValid(value);
  isChainCodeValid = (value: string): boolean => FIOSDK.isChainCodeValid(value);
  isPublicAddressValid = (value: string): boolean =>
    FIOSDK.isPublicAddressValid(value);

  createPrivateKeyMnemonic = async (mnemonic: string): Promise<string> => {
    const { fioKey } = await FIOSDK.createPrivateKeyMnemonic(mnemonic);

    return fioKey;
  };
  derivedPublicKey = (privateKey: string): string => {
    const { publicKey } = FIOSDK.derivedPublicKey(privateKey);

    return publicKey;
  };

  convert = (amount: number, roe: number): number =>
    Math.round((amount / (FIOSDK.SUFUnit / 100)) * roe) / 100;

  checkWallet = (): void => {
    if (!this.walletFioSDK) throw new Error('No wallet set.');
  };

  validateAction = (): void => {
    this.checkWallet();
    this.setBaseUrl();
  };

  validatePublicKey = async (publicKey: string): Promise<boolean> => {
    let isValid = false;
    try {
      this.isFioPublicKeyValid(publicKey);
      await this.publicFioSDK.getFioBalance(publicKey);
      isValid = true;
    } catch (e) {
      if (e.json && e.json.type !== 'invalid_input') {
        isValid = true;
      }
      //
    }

    return isValid;
  };

  setWalletFioSdk = (keys: { public: string; private: string }): void =>
    (this.walletFioSDK = new FIOSDK(
      keys.private,
      keys.public,
      this.baseurl,
      window.fetch,
    ));

  clearWalletFioSdk = (): null => (this.walletFioSDK = null);

  logError = (e: { errorCode: number }) => {
    if (e.errorCode !== 404) console.error(e);
  };

  extractError = (json: {
    fields?: { error: string }[];
    message?: string;
  }): string => {
    if (!json) return '';

    return json && json.fields && json.fields[0]
      ? json.fields[0].error
      : json.message;
  };

  getActor = (publicKey: string): string =>
    this.publicFioSDK.transactions.getActor(publicKey);

  availCheck = (fioName: string): Promise<AvailabilityResponse> => {
    this.setBaseUrl();
    return this.publicFioSDK.isAvailable(fioName);
  };

  register = async (fioName: string, fee: number): Promise<TrxResponse> => {
    this.validateAction();
    if (isDomain(fioName)) {
      return await this.walletFioSDK.registerFioDomain(fioName, fee);
    }
    return await this.walletFioSDK.registerFioAddress(fioName, fee);
  };

  getBalance = async (
    publicKey: string,
  ): Promise<{ balance: number; available: number; locked: number }> => {
    this.setBaseUrl();
    try {
      const { balance, available } = await this.publicFioSDK.getFioBalance(
        publicKey,
      );

      return {
        balance: FIOSDK.SUFToAmount(balance),
        available: FIOSDK.SUFToAmount(available),
        locked: 0,
      };
    } catch (e) {
      this.logError(e);
    }

    return {
      balance: 0,
      available: 0,
      locked: 0,
    };
  };

  getFioNames = async (publicKey: string): Promise<FioNamesResponse> => {
    this.setBaseUrl();
    try {
      // do not return method to handle errors here
      const res = await this.publicFioSDK.getFioNames(publicKey);
      return res;
    } catch (e) {
      this.logError(e);
    }

    return { fio_addresses: [], fio_domains: [] };
  };

  getFioAddresses = async (
    publicKey: string,
    limit: number,
    offset: number,
  ): Promise<FioAddressesResponse & { more: number }> => {
    this.setBaseUrl();
    try {
      const res = await this.publicFioSDK.getFioAddresses(
        publicKey,
        limit,
        offset,
      );
      return res;
    } catch (e) {
      this.logError(e);
    }

    return { fio_addresses: [], more: 0 };
  };

  getFioDomains = async (
    publicKey: string,
    limit: number,
    offset: number,
  ): Promise<FioDomainsResponse & { more: number }> => {
    this.setBaseUrl();
    try {
      const res = await this.publicFioSDK.getFioDomains(
        publicKey,
        limit,
        offset,
      );
      return res;
    } catch (e) {
      this.logError(e);
    }

    return { fio_domains: [], more: 0 };
  };

  getFioPublicAddress = async (
    fioAddress: string,
  ): Promise<PublicAddressResponse> => {
    this.setBaseUrl();
    try {
      const res = await this.publicFioSDK.getFioPublicAddress(fioAddress);
      return res;
    } catch (e) {
      this.logError(e);
    }

    return { public_address: '' };
  };

  getNFTs = async (
    searchParams: {
      fioAddress?: string;
      chainCode?: string;
      hash?: string;
      tokenId?: string;
      contractAddress?: string;
    },
    limit: number | null = null,
    offset: number | null = null,
  ): Promise<NftsResponse> => {
    this.setBaseUrl();
    try {
      return await this.publicFioSDK.getNfts(searchParams, limit, offset);
    } catch (e) {
      this.logError(e);
    }
    return {
      nfts: [],
      more: false,
    };
  };

  checkNftSigned = async (
    chainCode: string,
    contractAddress: string,
    tokenId: string,
  ): Promise<NftsResponse> => {
    this.setBaseUrl();
    try {
      return await this.publicFioSDK.getNfts({
        chainCode,
        contractAddress,
        tokenId,
      });
    } catch (e) {
      this.logError(e);
    }
    return {
      nfts: [],
      more: false,
    };
  };

  getTransferTokensAction = (
    publicKey: string,
    amount: number,
    fee: number,
  ) => {
    return {
      account: 'fio.token',
      name: 'trnsfiopubky',
      data: {
        payee_public_key: publicKey,
        amount,
        max_fee: fee,
        tpid: '',
      },
    };
  };

  getPublicAddresses = async (
    fioAddress: string,
    limit: number | null = null,
    offset: number | null = null,
  ): Promise<PublicAddressesResponse> => {
    this.setBaseUrl();
    try {
      return this.publicFioSDK.getPublicAddresses(fioAddress, limit, offset);
    } catch (err) {
      this.logError(err);
      throw err;
    }
  };

  singNFT = async (
    keys: WalletKeys,
    fioAddress: string,
    nfts: NFTTokenDoublet[],
  ): Promise<TrxResponse> => {
    try {
      const result = await this.executeAction(keys, ACTIONS.pushTransaction, {
        action: 'addnft',
        account: 'fio.address',
        data: {
          fio_address: fioAddress,
          nfts: nfts.map(
            ({ contractAddress, chainCode, tokenId, ...rest }) => ({
              contract_address: contractAddress,
              chain_code: chainCode,
              token_id: tokenId,
              ...rest,
            }),
          ),
          max_fee: DEFAULT_ACTION_FEE_AMOUNT,
          tpid: '',
        },
      });
      return { other: { nfts }, ...result };
    } catch (err) {
      this.logError(err);
      throw err;
    }
  };

  executeAction = async (
    keys: WalletKeys,
    action: string,
    params: any,
  ): Promise<TrxResponse> => {
    let error;
    this.setWalletFioSdk(keys);

    if (!params.maxFee) params.maxFee = DEFAULT_ACTION_FEE_AMOUNT;

    try {
      this.walletFioSDK.setSignedTrxReturnOption(true);
      const preparedTrx = await this.walletFioSDK.genericAction(action, params);
      this.validateAction();
      return await this.walletFioSDK.executePreparedTrx(
        this.actionEndPoints[ACTIONS_TO_END_POINT_KEYS[action]],
        preparedTrx,
      );
    } catch (err) {
      this.logError(err);
      error = err;
    } finally {
      this.clearWalletFioSdk();
    }

    if (error != null) throw error;
  };
}
