import {
  Account,
  Action,
  EndPoint,
  FioAddressesResponse,
  fioConstants,
  FioDomainsResponse,
  FioItem,
  FioLogger,
  FioNamesResponse,
  FIOSDK,
  FioSentItem,
  GenericAction,
  GetObtDataDecryptedResponse,
  NftsResponse,
  PublicAddress,
  PublicAddressesResponse,
  PublicAddressResponse,
  ReceivedFioRequestsDecryptedResponse,
  SentFioRequestsDecryptedResponse,
} from '@fioprotocol/fiosdk';
import { createHash } from 'crypto-browserify';
import superagent from 'superagent';

import MathOp from '../util/math';
import { log } from '../util/general';

import { camelizeFioRequestsData, isDomain } from '../utils';

import {
  DEFAULT_FIO_RECORDS_LIMIT,
  DEFAULT_TABLE_RAWS_LIMIT,
  FIO_PROXY_LIST,
  getEndPointByGenericAction,
} from '../constants/fio';

import {
  AnyObject,
  DetailedProxy,
  FioBalanceRes,
  FioRecord,
  NFTTokenDoublet,
  Proxy,
  WalletKeys,
} from '../types';
import { FioDomainDoubletResponse } from './responses';

export interface TrxResponse {
  transaction_id?: string;
  status?: string;
  expiration?: string;
  fee_collected: number;
  oracle_fee_collected?: number;
  other?: AnyObject;
}

export interface SignedTxArgs {
  id?: string;
  compression: number;
  packed_context_free_data: string;
  packed_trx: string;
  signatures: string[];
}

export type TrxResponsePaidBundles = TrxResponse & {
  bundlesCollected?: number;
};

type GetTableRawsParams = {
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
};

export const DEFAULT_ACTION_FEE_AMOUNT = new MathOp(FIOSDK.SUFUnit)
  .mul(1500)
  .toNumber();
export const ENDPOINT_FEE_HASH: { [endpoint: string]: string } = {
  [EndPoint.stakeFioTokens]: '0x83c48bde1205347001e4ddd44c571f78',
  [EndPoint.unStakeFioTokens]: '0x85248efc2886d68989b010f21cb2f480',
};

const fioLogger: FioLogger = message => {
  const { type, context } = message;
  if (type === 'request' && context.error && context.error.errorCode !== 404) {
    log.error(message.context.error);
  }
};

export default class Fio {
  baseurls: string[] = [];
  publicFioSDK: FIOSDK | null = null;
  walletFioSDK: FIOSDK | null = null;
  tpid: string = process.env.REACT_APP_DEFAULT_TPID || '';
  domainTpid: string = process.env.REACT_APP_DEFAULT_TPID || '';
  fioChainIdEnvironment: string = process.env.REACT_APP_FIO_CHAIN_ID || '';

  constructor() {
    this.publicFioSDK = new FIOSDK({
      apiUrls: this.baseurls,
      fetchJson: window.fioCorsFixfetch,
      logger: fioLogger,
      technologyProviderId: this.tpid,
    });
  }

  setTpid = (tpid: string | null, domainTpid?: string): void => {
    this.tpid = tpid;
    this.domainTpid = domainTpid || tpid;
    this.publicFioSDK.technologyProviderId = tpid;
  };

  setApiUrls = (apiUrls: string[]): void => {
    this.baseurls = apiUrls;
    this.publicFioSDK.setApiUrls(apiUrls);
  };

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

  createPrivateKeyMnemonic = async (mnemonic: string): Promise<string> => {
    const { fioKey } = await FIOSDK.createPrivateKeyMnemonic(mnemonic);

    return fioKey;
  };
  derivedPublicKey = (privateKey: string): string => {
    const { publicKey } = FIOSDK.derivedPublicKey(privateKey);

    return publicKey;
  };

  convertFioToUsdc = (nativeAmount: number, roe: number | null): number => {
    if (roe == null) return 0;

    return new MathOp(FIOSDK.SUFToAmount(nativeAmount))
      .mul(roe)
      .round(2, 1)
      .toNumber();
  };

  convertUsdcToFio = (amount: number, roe: number | null): number => {
    if (roe == null) return 0;

    return new MathOp(amount)
      .div(roe)
      .round(9, 2)
      .toNumber();
  };

  checkWallet = (): void => {
    if (!this.walletFioSDK) throw new Error('No wallet set.');
  };

  validateAction = (): void => {
    this.checkWallet();
  };

  validatePublicKey = async (publicKey: string): Promise<boolean> => {
    let isValid = false;
    try {
      FIOSDK.isFioPublicKeyValid(publicKey);
      await this.publicFioSDK.getFioBalance({
        fioPublicKey: publicKey,
      });
      isValid = true;
    } catch (e) {
      // TODO refactor error handling
      if (e.json && e.json.type !== 'invalid_input') {
        isValid = true;
      }
      //
    }

    return isValid;
  };

  // todo: check if we need to update tpid for public wallet FIOSDK in other place
  createPublicWalletFioSdk = (keys: { public: string }): FIOSDK => {
    return new FIOSDK({
      publicKey: keys.public,
      apiUrls: this.baseurls,
      fetchJson: window.fioCorsFixfetch,
      logger: fioLogger,
      technologyProviderId: this.tpid,
    });
  };

  setWalletFioSdk = (keys: { public: string; private: string }) => {
    this.walletFioSDK = new FIOSDK({
      privateKey: keys.private,
      publicKey: keys.public,
      apiUrls: this.baseurls,
      fetchJson: window.fioCorsFixfetch,
      logger: fioLogger,
      technologyProviderId: this.tpid,
    });
  };

  clearWalletFioSdk = (): null => (this.walletFioSDK = null);

  logError = (e: { errorCode: number; message: string }) => {
    if (e.errorCode !== 404) log.error(e.message);
  };

  setTableRowsParams = (
    fioName: string,
  ): {
    code: Account;
    scope: Account;
    table: string;
    lower_bound: string;
    upper_bound?: string;
    key_type?: string;
    index_position?: string;
    json?: boolean;
    reverse?: boolean;
    limit?: number;
  } => {
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
      code: Account.address,
      scope: Account.address,
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

    return params;
  };

  availCheckTableRows = async (fioName: string): Promise<boolean> => {
    const params = this.setTableRowsParams(fioName);

    try {
      const { rows } = await this.getTableRows(params);

      if (rows && rows.length) {
        const rowId = rows[0].id;
        return !!rowId || rowId === 0;
      }
    } catch (e) {
      this.logError(e);
    }

    return false;
  };

  availCheck = (fioName: string) => {
    return this.publicFioSDK.isAvailable({ fioName });
  };

  getTableRows = async (params: GetTableRawsParams) => {
    const getTableRowsRequest = async ({
      params,
      url,
    }: {
      params: GetTableRawsParams;
      url: string;
    }) => {
      const response = await superagent.post(url).send(params);

      const {
        rows,
        more,
      }: { rows: AnyObject[]; more: boolean } = response.body;

      return { rows, more };
    };

    for (let i = 0; i < this.baseurls.length; i++) {
      const url = `${this.baseurls[i]}chain/get_table_rows`;

      try {
        return await getTableRowsRequest({ params, url });
      } catch (err) {
        this.logError(err);
        // If this was the last URL, throw the error
        if (i === this.baseurls.length - 1) {
          throw err;
        }
      }
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
      } = await this.publicFioSDK.getFioBalance({
        fioPublicKey: publicKey,
      });

      const rewardsAmount = !roe
        ? 0
        : new MathOp(srps)
            .mul(roe)
            .sub(staked)
            .round(0, 2)
            .toNumber();

      const rewards = new MathOp(rewardsAmount).lt(0) ? 0 : rewardsAmount;

      balances = {
        ...balances,
        balance,
        available,
        staked,
        rewards,
      };
    } catch (e) {
      this.logError(e);
    }

    try {
      const {
        remaining_lock_amount,
        time_stamp,
        unlock_periods,
      } = await this.publicFioSDK.getLocks({ fioPublicKey: publicKey });

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
      res = await this.publicFioSDK.getFioNames({ fioPublicKey: publicKey });
    } catch (e) {
      this.logError(e);
    }

    return res;
  };

  getFioAddresses = async (
    publicKey: string,
    limit: number,
    offset: number,
  ): Promise<FioAddressesResponse> => {
    let res: FioAddressesResponse = {
      fio_addresses: [],
      more: 0,
    };
    try {
      res = await this.publicFioSDK.getFioAddresses({
        fioPublicKey: publicKey,
        limit,
        offset,
      });
    } catch (e) {
      this.logError(e);
    }

    return res;
  };

  getFioDomains = async (
    publicKey: string,
    limit: number,
    offset: number,
  ): Promise<FioDomainsResponse> => {
    let res: FioDomainsResponse = {
      fio_domains: [],
      more: 0,
    };
    try {
      res = await this.publicFioSDK.getFioDomains({
        fioPublicKey: publicKey,
        limit,
        offset,
      });
    } catch (e) {
      this.logError(e);
    }

    return res;
  };

  getFioDomain = async (
    domainName: string,
  ): Promise<FioDomainDoubletResponse> => {
    try {
      const tableRowsParams = this.setTableRowsParams(domainName);

      const {
        rows,
      }: { rows: FioDomainDoubletResponse[] } = await this.getTableRows(
        tableRowsParams,
      );

      return rows.length ? rows[0] : null;
    } catch (e) {
      this.logError(e);
    }
  };

  getFioPublicAddress = async (
    fioAddress: string,
  ): Promise<PublicAddressResponse> => {
    let res: PublicAddressResponse = { public_address: '' };
    try {
      res = await this.publicFioSDK.getFioPublicAddress({ fioAddress });
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
      return await this.publicFioSDK.getNfts({
        ...searchParams,
        limit,
        offset,
      });
    } catch (e) {
      this.logError(e);
    }
    return {
      nfts: [],
      more: 0,
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
      more: 0,
    };
  };

  getPublicAddresses = async (
    fioAddress: string,
    limit: number | null = null,
    offset: number | null = null,
  ): Promise<
    PublicAddressesResponse & { public_addresses?: PublicAddress[] }
  > => {
    try {
      return this.publicFioSDK.getPublicAddresses({
        fioAddress,
        limit,
        offset,
      });
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
      const result = await this.executeAction(
        keys,
        GenericAction.pushTransaction,
        {
          action: Action.addNft,
          account: fioConstants.defaultAccount,
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
            tpid: this.tpid,
          },
        },
      );
      return { other: { nfts }, ...result };
    } catch (err) {
      this.logError(err);
      throw err;
    }
  };

  executeAction = async (
    keys: WalletKeys,
    action: GenericAction,
    params: AnyObject,
  ): Promise<TrxResponse> => {
    this.setWalletFioSdk(keys);

    if (!params.maxFee) params.maxFee = DEFAULT_ACTION_FEE_AMOUNT;

    try {
      this.walletFioSDK.setSignedTrxReturnOption(true);
      const preparedTrx = await this.walletFioSDK.genericAction(action, params);
      this.validateAction();
      const result = await this.walletFioSDK.executePreparedTrx(
        getEndPointByGenericAction(action),
        preparedTrx as object,
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
      const rows: Proxy[] = await this.getProxyRows();

      const rowsProxies = rows
        .filter(row => row.is_proxy && row.fioaddress)
        .map(row => row.fioaddress);

      const defaultProxyList = FIO_PROXY_LIST[this.fioChainIdEnvironment] || [];

      const rowsProxiesList =
        rowsProxies.length < defaultProxyList.length
          ? defaultProxyList
          : rowsProxies;

      proxies = [...rowsProxiesList];
    } catch (err) {
      this.logError(err);
    }

    return (
      proxies ||
      FIO_PROXY_LIST[this.fioChainIdEnvironment] || [
        `${process.env.REACT_APP_FIO_DEFAULT_PROXY}`,
      ]
    );
  };

  getDetailedProxies = async (): Promise<DetailedProxy[]> => {
    let proxies;
    try {
      const rows: Proxy[] = await this.getProxyRows();

      proxies = rows
        .filter(row => row.is_proxy && row.fioaddress)
        .map(row => ({
          id: row.id,
          proxy: row.proxy,
          owner: row.owner,
          lastVoteWeight: parseFloat(row.last_vote_weight),
          proxiedVoteWeight: parseFloat(row.proxied_vote_weight),
          fioAddress: row.fioaddress,
          producers: row.producers,
        }));
    } catch (err) {
      this.logError(err);
    }

    return proxies;
  };

  getProxyRows = async () => {
    let rows: Proxy[] = [];

    const getRows = async ({
      limit = DEFAULT_TABLE_RAWS_LIMIT,
      offset = 0,
    }: {
      limit: number;
      offset: number;
    }) =>
      await this.getTableRows({
        code: Account.eosio,
        scope: Account.eosio,
        table: 'voters',
        limit,
        lower_bound: offset?.toString() || '0',
        reverse: false,
        json: true,
      });

    const getAllRows = async ({
      limit = DEFAULT_TABLE_RAWS_LIMIT,
      offset = 0,
    }: {
      limit?: number;
      offset?: number;
    }) => {
      const rowsResponse = await getRows({
        limit,
        offset,
      });

      rows = [...rows, ...rowsResponse.rows];

      const updatedLimit = rowsResponse.rows?.length || limit;

      if (rowsResponse.more) {
        await getAllRows({ offset: offset + updatedLimit });
      }
    };

    await getAllRows({});

    return rows;
  };

  getFeeFromTable = async (feeHash: string): Promise<{ fee: number }> => {
    const resultRows: {
      rows: {
        end_point: string;
        end_point_hash: string;
        suf_amount: number;
      }[];
    } = await this.getTableRows({
      code: Account.fee,
      scope: Account.fee,
      table: 'fiofees',
      lower_bound: feeHash,
      upper_bound: feeHash,
      key_type: 'i128',
      index_position: '2',
      json: true,
    });

    return { fee: resultRows.rows[0].suf_amount };
  };

  getAccountPubKey = async (account: string): Promise<string> => {
    // TODO: move to getAccountPubKey after update to fio_sdk to 1.9
    try {
      const { rows } = await this.getTableRows({
        json: true,
        code: Account.address,
        scope: Account.address,
        table: 'accountmap',
        lower_bound: account,
        upper_bound: account,
        index_position: '1',
        key_type: '',
        limit: 1,
        reverse: false,
      });

      if (rows.length > 0) {
        return rows[0].clientkey;
      }

      return '';
    } catch (err) {
      this.logError(err);
    }
  };

  getFioRequests = async ({
    publicKey,
    action,
  }: {
    publicKey: string;
    action:
      | GenericAction.getReceivedFioRequests
      | GenericAction.getSentFioRequests
      | GenericAction.getObtData;
  }): Promise<FioRecord[]> => {
    let fioRequestsArr: FioRecord[] = [];

    try {
      const walletFioSdk = this.createPublicWalletFioSdk({
        public: publicKey,
      });

      const getFioRequests = async ({
        limit = 100,
        offset = 0,
      }): Promise<
        | ReceivedFioRequestsDecryptedResponse
        | SentFioRequestsDecryptedResponse
        | GetObtDataDecryptedResponse
      > => {
        return await walletFioSdk.genericAction(action, {
          limit,
          offset,
          includeEncrypted: true,
        });
      };

      const getAllFioRequests = async ({
        limit = DEFAULT_FIO_RECORDS_LIMIT,
        offset,
      }: {
        limit?: number;
        offset?: number;
      }) => {
        const fioRequests = await getFioRequests({
          limit,
          offset,
        });

        let fioRequestsItems: (FioItem | FioSentItem)[] = [];

        if ('requests' in fioRequests) {
          fioRequestsItems = fioRequests.requests;
        }

        if ('obt_data_records' in fioRequests) {
          fioRequestsItems = fioRequests.obt_data_records;
        }

        fioRequestsArr = [
          ...fioRequestsArr,
          ...camelizeFioRequestsData(fioRequestsItems),
        ];

        if (fioRequests.more) {
          await getAllFioRequests({ offset: offset ? offset + limit : limit });
        }
      };

      await getAllFioRequests({});

      return fioRequestsArr;
    } catch (err) {
      log.error(err);
    }
  };

  getReceivedFioRequests = async (publicKey: string): Promise<FioRecord[]> => {
    return await this.getFioRequests({
      publicKey,
      action: GenericAction.getReceivedFioRequests,
    });
  };

  getSentFioRequests = async (publicKey: string): Promise<FioRecord[]> => {
    return await this.getFioRequests({
      publicKey,
      action: GenericAction.getSentFioRequests,
    });
  };

  getObtData = async (publicKey: string): Promise<FioRecord[]> => {
    return await this.getFioRequests({
      publicKey,
      action: GenericAction.getObtData,
    });
  };

  getRawAbi = async (): Promise<void> => {
    for (const accountName of Object.values(Account)) {
      try {
        if (!FIOSDK.abiMap.get(accountName)) {
          const abiResponse = await this.publicFioSDK.getAbi({ accountName });
          FIOSDK.abiMap.set(abiResponse.account_name, abiResponse);
        }
      } catch (e) {
        log.error('Raw Abi Error:', e);
      }
    }
  };
}
