import { FIOSDK } from '@fioprotocol/fiosdk';
import { createHash } from 'crypto-browserify';
import superagent from 'superagent';

import { AvailabilityResponse } from '@fioprotocol/fiosdk/src/entities/AvailabilityResponse';
import { FioNamesResponse } from '@fioprotocol/fiosdk/src/entities/FioNamesResponse';
import { FioAddressesResponse } from '@fioprotocol/fiosdk/src/entities/FioAddressesResponse';
import { FioDomainsResponse } from '@fioprotocol/fiosdk/src/entities/FioDomainsResponse';
import { PublicAddressResponse } from '@fioprotocol/fiosdk/src/entities/PublicAddressResponse';
import { PublicAddressesResponse } from '@fioprotocol/fiosdk/src/entities/PublicAddressesResponse';
import { EndPoint } from '@fioprotocol/fiosdk/lib/entities/EndPoint';
import { NftsResponse } from '@fioprotocol/fiosdk/src/entities/NftsResponse';

import MathOp from '../util/math';
import { log } from '../util/general';

import { isDomain } from '../utils';

import {
  ACTIONS,
  ACTIONS_TO_END_POINT_KEYS,
  GET_TABLE_ROWS_URL,
} from '../constants/fio';

import {
  FioBalanceRes,
  NFTTokenDoublet,
  WalletKeys,
  Proxy,
  AnyObject,
} from '../types';

export interface TrxResponse {
  transaction_id?: string;
  status: string;
  expiration?: string;
  fee_collected: number;
  other?: AnyObject;
}

export type TrxResponsePaidBundles = TrxResponse & {
  bundlesCollected?: number;
};

export type FIOSDK_LIB = typeof FIOSDK;

export const DEFAULT_ACTION_FEE_AMOUNT = new MathOp(FIOSDK.SUFUnit)
  .mul(800)
  .toNumber();
export const ENDPOINT_FEE_HASH: { [endpoint: string]: string } = {
  [EndPoint.stakeFioTokens]: '0x83c48bde1205347001e4ddd44c571f78',
  [EndPoint.unStakeFioTokens]: '0x85248efc2886d68989b010f21cb2f480',
};

export default class Fio {
  baseurl: string = process.env.REACT_APP_FIO_BASE_URL || '';
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

  amountToSUF = (amount: number): number => {
    if (!amount) return 0;
    const floor = Math.floor(amount);
    const tempResult = new MathOp(floor).mul(FIOSDK.SUFUnit).toNumber();

    // get remainder
    const remainder: number = new MathOp(amount)
      .mod(1)
      .round(9, 2)
      .toNumber();

    const remainderResult: number = new MathOp(remainder)
      .mul(FIOSDK.SUFUnit)
      .toNumber();
    const floorRemainder = Math.floor(remainderResult);

    // add integer and remainder
    return new MathOp(tempResult).add(floorRemainder).toNumber();
  };

  sufToAmount = (suf: number): number => {
    return FIOSDK.SUFToAmount(suf);
  };

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

  convertFioToUsdc = (nativeAmount: number, roe: number): number =>
    new MathOp(this.sufToAmount(nativeAmount))
      .mul(roe)
      .round(2, 1)
      .toNumber();

  convertUsdcToFio = (amount: number, roe: number): number =>
    new MathOp(amount)
      .div(roe)
      .round(9, 2)
      .toNumber();

  checkWallet = (): void => {
    if (!this.walletFioSDK) throw new Error('No wallet set.');
  };

  validateAction = (): void => {
    this.checkWallet();
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

  createPublicWalletFioSdk = (keys: { public: string }): FIOSDK_LIB =>
    new FIOSDK('', keys.public, this.baseurl, window.fetch);

  setWalletFioSdk = (keys: { public: string; private: string }): void =>
    (this.walletFioSDK = new FIOSDK(
      keys.private,
      keys.public,
      this.baseurl,
      window.fetch,
    ));

  clearWalletFioSdk = (): null => (this.walletFioSDK = null);

  logError = (e: { errorCode: number; message: string }) => {
    if (e.errorCode !== 404) log.error(e.message);
  };

  extractError = (json: {
    fields?: { error: string }[];
    message?: string;
  }): string => {
    if (!json) return '';

    return json.fields?.length ? json.fields[0].error : json.message || 'error';
  };

  getActor = (publicKey: string): string =>
    this.publicFioSDK.transactions.getActor(publicKey);

  availCheckTableRows = async (fioName: string): Promise<boolean> => {
    const hash = createHash('sha1');
    const bound =
      '0x' +
      hash
        .update(fioName)
        .digest()
        .slice(0, 16)
        .reverse()
        .toString('hex');

    const params = {
      code: 'fio.address',
      scope: 'fio.address',
      table: 'fionames',
      lower_bound: bound,
      upper_bound: bound,
      key_type: 'i128',
      index_position: '5',
      json: true,
    };
    if (isDomain(fioName)) {
      params.table = 'domains';
      params.index_position = '4';
    }

    try {
      const rows = await this.getTableRows(params);

      if (rows && rows.length) {
        return !!rows[0].id;
      }
    } catch (e) {
      this.logError(e);
    }

    return false;
  };

  availCheck = (fioName: string): Promise<AvailabilityResponse> => {
    return this.publicFioSDK.isAvailable(fioName);
  };

  register = async (fioName: string, fee: number): Promise<TrxResponse> => {
    this.validateAction();
    if (isDomain(fioName)) {
      return await this.walletFioSDK.registerFioDomain(fioName, fee);
    }
    return await this.walletFioSDK.registerFioAddress(fioName, fee);
  };

  getTableRows = async (params: {
    code: string;
    scope: string;
    table: string;
    lower_bound: string;
    upper_bound?: string;
    key_type?: string;
    index_position?: string;
    json?: boolean;
    reverse?: boolean;
    limit?: number;
  }) => {
    try {
      const response = await superagent.post(GET_TABLE_ROWS_URL).send(params);

      const { rows }: { rows: AnyObject[] } = response.body;

      return rows;
    } catch (err) {
      this.logError(err);
      throw err;
    }
  };

  getBalance = async (publicKey: string): Promise<FioBalanceRes> => {
    let balances: FioBalanceRes = {
      balance: 0,
      available: 0,
      staked: 0,
      locked: 0,
      rewards: 0,
      unlockPeriods: [],
    };
    try {
      const {
        balance,
        available,
        staked,
        srps,
        roe,
      } = await this.publicFioSDK.getFioBalance(publicKey);

      balances = {
        ...balances,
        balance,
        available,
        staked,
        rewards: new MathOp(srps)
          .mul(roe)
          .round(0, 2)
          .sub(staked)
          .toNumber(),
      };
    } catch (e) {
      this.logError(e);
    }

    try {
      const {
        remaining_lock_amount,
        time_stamp,
        unlock_periods,
      } = await this.publicFioSDK.getLocks(publicKey);

      balances = {
        ...balances,
        locked: remaining_lock_amount,
        unlockPeriods: unlock_periods.map(
          ({ amount, duration }: { amount: number; duration: number }) => ({
            amount,
            date: (time_stamp + duration) * 1000, // unlock date-time in ms
          }),
        ),
      };
    } catch (e) {
      this.logError(e);
    }

    return balances;
  };

  getFioNames = async (publicKey: string): Promise<FioNamesResponse> => {
    let res: FioNamesResponse = { fio_addresses: [], fio_domains: [] };
    try {
      res = await this.publicFioSDK.getFioNames(publicKey);
    } catch (e) {
      this.logError(e);
    }

    return res;
  };

  getFioAddresses = async (
    publicKey: string,
    limit: number,
    offset: number,
  ): Promise<FioAddressesResponse & { more: number }> => {
    let res: FioAddressesResponse & { more: number } = {
      fio_addresses: [],
      more: 0,
    };
    try {
      res = await this.publicFioSDK.getFioAddresses(publicKey, limit, offset);
    } catch (e) {
      this.logError(e);
    }

    return res;
  };

  getFioDomains = async (
    publicKey: string,
    limit: number,
    offset: number,
  ): Promise<FioDomainsResponse & { more: number }> => {
    let res: FioDomainsResponse & { more: number } = {
      fio_domains: [],
      more: 0,
    };
    try {
      res = await this.publicFioSDK.getFioDomains(publicKey, limit, offset);
    } catch (e) {
      this.logError(e);
    }

    return res;
  };

  getFioPublicAddress = async (
    fioAddress: string,
  ): Promise<PublicAddressResponse> => {
    let res: PublicAddressResponse = { public_address: '' };
    try {
      res = await this.publicFioSDK.getFioPublicAddress(fioAddress);
    } catch (e) {
      this.logError(e);
    }

    return res;
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
    params: AnyObject,
  ): Promise<TrxResponse> => {
    this.setWalletFioSdk(keys);

    if (!params.maxFee) params.maxFee = DEFAULT_ACTION_FEE_AMOUNT;

    try {
      this.walletFioSDK.setSignedTrxReturnOption(true);
      const preparedTrx = await this.walletFioSDK.genericAction(action, params);
      this.validateAction();
      const result = await this.walletFioSDK.executePreparedTrx(
        this.actionEndPoints[ACTIONS_TO_END_POINT_KEYS[action]],
        preparedTrx,
      );
      this.clearWalletFioSdk();
      return result;
    } catch (err) {
      this.logError(err);
      this.clearWalletFioSdk();
      throw err;
    }
  };

  getProxies = async () => {
    let proxies;
    try {
      const rows: Proxy[] = await this.getTableRows({
        code: 'eosio',
        scope: 'eosio',
        table: 'voters',
        limit: 2000,
        lower_bound: '0',
        reverse: true,
        json: true,
      });

      const rowsProxies = rows
        .filter(row => row.is_proxy && row.fioaddress)
        .map(row => row.fioaddress);

      proxies = [...rowsProxies];
    } catch (err) {
      this.logError(err);
    }

    return proxies || [`${process.env.REACT_APP_FIO_DEFAULT_PROXY}`];
  };

  getFeeFromTable = async (feeHash: string): Promise<{ fee: number }> => {
    const resultRows: {
      end_point: string;
      end_point_hash: string;
      suf_amount: number;
    }[] = await this.getTableRows({
      code: 'fio.fee',
      scope: 'fio.fee',
      table: 'fiofees',
      lower_bound: feeHash,
      upper_bound: feeHash,
      key_type: 'i128',
      index_position: '2',
      json: true,
    });

    return { fee: resultRows[0].suf_amount };
  };
}
