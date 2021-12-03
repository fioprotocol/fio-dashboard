import { TextDecoder, TextEncoder } from 'text-encoding';
import { Transactions as FioTransactionsProvider } from '@fioprotocol/fiosdk/lib/transactions/Transactions';
import { PublicAddress } from '@fioprotocol/fiosdk/src/entities/PublicAddress';
import { Api as ChainApi, Numeric as ChainNumeric } from '@fioprotocol/fiojs';

import apis from '../api';
import { sleep } from '../utils';
import { log } from '../util/general';

import { FREE_ADDRESS_REGISTER_ERROR, ERROR_TYPES } from '../constants/errors';
import { FIO_REQUEST_STATUS_TYPES } from '../constants/fio';
import { CHAIN_CODES } from '../constants/common';
import { RegisterAddressError } from './errors';

import {
  NftTokenResponse,
  NFTTokenDoublet,
  Prices,
  PublicAddressDoublet,
  IncomePrices,
} from '../types';
import { RawTransaction } from '../api/fio';

export const waitForAddressRegistered = async (
  fioAddress: string,
): Promise<void> => {
  const CALL_INTERVAL = 3000; // 3 sec
  const WAIT_TIMEOUT = 60000; // 60 sec
  const startTime = new Date().getTime();

  const checkAddressIsRegistered: () => Promise<void> = async () => {
    try {
      const { is_registered } = await apis.fio.availCheck(fioAddress);
      if (is_registered) return;
    } catch (e) {
      //
    }
    const timeOver = new Date().getTime() - startTime >= WAIT_TIMEOUT;
    if (timeOver)
      throw new RegisterAddressError({
        errorType: ERROR_TYPES.freeAddressIsNotRegistered,
        message: FREE_ADDRESS_REGISTER_ERROR,
      });
    await sleep(CALL_INTERVAL);
    return checkAddressIsRegistered();
  };

  return checkAddressIsRegistered();
};

export const transformNft = (nfts: NftTokenResponse[]): NFTTokenDoublet[] => {
  const nftList = [];
  for (const item of nfts) {
    const nftItem = {
      fioAddress: item.fio_address,
      contractAddress: item.contract_address,
      chainCode: item.chain_code,
      tokenId: item.token_id,
      url: item.url,
      hash: item.hash,
      metadata: item.metadata,
    };
    nftList.push(nftItem);
  }
  return nftList;
};

export const fioAddressToPubKey = async (
  fioAddress: string,
): Promise<string> => {
  let isFioAddress = false;
  let pubKey = '';
  try {
    apis.fio.isFioAddressValid(fioAddress);
    isFioAddress = true;
  } catch (e) {
    //
  }

  if (isFioAddress) {
    try {
      const {
        public_address: publicAddress,
      } = await apis.fio.getFioPublicAddress(fioAddress);
      pubKey = publicAddress;
    } catch (e) {
      //
    }
  }

  return pubKey;
};

export const genericTokenId = (
  chainCode: string,
  tokenId: string,
  contractAddress: string,
): string => `${chainCode}-${tokenId}-${contractAddress}`;

export const transformPublicAddresses = (
  publicAddresses: PublicAddressDoublet[],
): PublicAddress[] =>
  publicAddresses.map(publicAddressObj => {
    const { chainCode, tokenCode, publicAddress } = publicAddressObj;

    return {
      chain_code: chainCode,
      token_code: tokenCode === '*' ? chainCode : tokenCode,
      public_address: publicAddress,
    };
  });

export const normalizePublicAddresses = (
  publicAddresses: PublicAddressDoublet[],
): PublicAddressDoublet[] =>
  publicAddresses.map(({ chainCode, tokenCode, publicAddress }) => ({
    chainCode,
    tokenCode: tokenCode === '*' ? chainCode : tokenCode,
    publicAddress,
  }));

export const statusBadgeColours = (
  status: string,
): { isBlue: boolean; isOrange: boolean; isRose: boolean } => ({
  isBlue: FIO_REQUEST_STATUS_TYPES.PAID === status,
  isOrange: FIO_REQUEST_STATUS_TYPES.REJECTED === status,
  isRose: FIO_REQUEST_STATUS_TYPES.PENDING === status,
});

export const isFioChain = (chain: string): boolean => chain === CHAIN_CODES.FIO;

export const convertPrices = (prices: IncomePrices): { pricing: Prices } => {
  const pricing = {
    ...prices.pricing,
    fio: { address: 0, domain: 0 },
    usdt: { address: 0, domain: 0 },
  };

  pricing.fio = {
    address: apis.fio.sufToAmount(pricing.nativeFio.address) || 0,
    domain: apis.fio.sufToAmount(pricing.nativeFio.domain) || 0,
  };

  pricing.usdt = {
    address: apis.fio.convertFioToUsdc(
      pricing.nativeFio.address,
      pricing.usdtRoe,
    ),
    domain: apis.fio.convertFioToUsdc(
      pricing.nativeFio.domain,
      pricing.usdtRoe,
    ),
  };
  return { pricing };
};

export const serializeTransaction = async (
  tx: RawTransaction,
): Promise<string> => {
  try {
    const abiProvider: any = {
      getRawAbi: async (accountName: string) => {
        const rawAbi = FioTransactionsProvider.abiMap.get(accountName);
        if (!rawAbi) {
          throw new Error(`Missing ABI for account ${accountName}`);
        }
        const abi = ChainNumeric.base64ToBinary(rawAbi.abi);
        const binaryAbi: any = { accountName: rawAbi.account_name, abi };
        return binaryAbi;
      },
    };
    const chainApi = new ChainApi({
      signatureProvider: null,
      authorityProvider: null,
      abiProvider,
      chainId: null,
      textDecoder: new TextDecoder(),
      textEncoder: new TextEncoder(),
    });
    tx = {
      ...tx,
      context_free_actions: await chainApi.serializeActions(
        tx.context_free_actions || [],
      ),
      actions: await chainApi.serializeActions(tx.actions),
    };

    return Buffer.from(chainApi.serializeTransaction(tx)).toString('hex');
  } catch (e) {
    log.error(e);
  }

  return '';
};
