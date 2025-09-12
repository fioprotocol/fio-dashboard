import { EdgeAccount, EdgeCurrencyWallet } from 'edge-core-js';
import { TextDecoder, TextEncoder } from 'text-encoding';
import { Fio } from '@fioprotocol/fiojs';
import mapKeys from 'lodash/mapKeys';
import camelCase from 'camelcase';
import { FioItem, FioSentItem } from '@fioprotocol/fiosdk';

import {
  Domain,
  FioNameItemProps,
  FioRecord,
  WalletKeys,
  EdgeWalletsKeys,
  DecryptedFioRecordContent,
  Unknown,
  AnyObject,
} from './types';

const FIO_DASH_USERNAME_DELIMITER = `.fio.dash.${process.env
  .REACT_APP_EDGE_ACC_DELIMITER || ''}`;

export const FIO_ADDRESS_DELIMITER = '@';

// todo
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function compose(...funcs: ((args?: any) => any)[]): any {
  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}

export function currentYear(): string {
  const year = new Date().getFullYear();
  const startYear = 2021;
  return year === startYear ? `${year}` : `${startYear} - ${year}`;
}

export async function minWaitTimeFunction(
  cb: () => Promise<Unknown>,
  minWaitTime = 1000,
): Promise<Unknown> {
  let results;
  let error;
  const t0 = performance.now();
  try {
    results = await cb();
  } catch (e) {
    error = e;
  }
  const t1 = performance.now();
  if (t1 - t0 < minWaitTime) {
    await sleep(minWaitTime - (t1 - t0));
  }
  if (error != null) throw error;
  return results;
}

export function emailToUsername(email: string): string {
  if (email && email.indexOf('@') > 0) {
    const [name, domain] = email.toLowerCase().split('@');
    // return name
    return `${name}${FIO_DASH_USERNAME_DELIMITER}${domain}`;
  }

  return '';
}

export const getWalletKeys = async ({
  account,
  fioWallets,
}: {
  account: EdgeAccount;
  fioWallets: EdgeCurrencyWallet[];
}): Promise<EdgeWalletsKeys> => {
  const keys: EdgeWalletsKeys = {};
  for (const fioWallet of fioWallets) {
    const privateKey = await account.getDisplayPrivateKey(fioWallet.id);
    keys[fioWallet.id] = {
      private: privateKey,
      public: fioWallet.publicWalletInfo.keys.publicKey,
    };
  }
  return keys;
};

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const setDataMutator = (
  args: [string, object],
  state: { fields: { [fieldName: string]: { data: object } } },
): void => {
  const [name, data] = args;
  const field = state.fields[name];

  if (field) {
    field.data = { ...field.data, ...data };
  }
};

export const isFreeDomain = ({
  domains,
  domain,
}: {
  domains: Domain[];
  domain: string;
}): boolean => {
  if (!domain) {
    return true;
  }
  const domainFromList = domains.find(item => item.domain === domain);
  return !!domainFromList?.free;
};

export const isDomain = (fioName: string): boolean =>
  fioName.indexOf(FIO_ADDRESS_DELIMITER) < 0;
export const hasFioAddressDelimiter = (value: string): boolean =>
  value.indexOf(FIO_ADDRESS_DELIMITER) > 0;
export const setFioName = (address: string | null, domain: string): string =>
  address ? `${address}${FIO_ADDRESS_DELIMITER}${domain}` : domain;

export const getElementByFioName = ({
  fioNameList,
  name,
}: {
  fioNameList: FioNameItemProps[];
  name: string;
}): FioNameItemProps => {
  return (
    fioNameList &&
    fioNameList.find(
      ({ name: itemName }: FioNameItemProps) => itemName === name,
    )
  );
};

export const camelizeFioRequestsData = (
  data: (FioSentItem | FioItem)[],
): FioRecord[] => {
  const result: FioRecord[] = [];
  data.forEach((o: FioSentItem | FioItem, i: number) => {
    const resultItem: FioRecord = {
      content: '',
      fioRequestId: 0,
      payeeFioAddress: '',
      payeeFioPublicKey: '',
      payerFioAddress: '',
      payerFioPublicKey: '',
      status: '',
      timeStamp: '',
    };
    for (const [key, value] of Object.entries(o)) {
      const itemKey: keyof FioRecord = camelCase(key) as keyof FioRecord;
      if (resultItem[itemKey] !== undefined) {
        // @ts-ignore // todo
        resultItem[itemKey] = value;
      }
    }
    if (resultItem.status) result[i] = resultItem;
  });
  return result;
};

export const camelizeObjKeys = (obj: {}): AnyObject => {
  return mapKeys(obj, (val, key) => camelCase(key));
};

export const decryptFioRequestData = ({
  data,
  walletKeys,
  contentType,
}: {
  data: {
    content: string;
    payerFioPublicKey: string;
    payeeFioPublicKey: string;
  };
  walletKeys: WalletKeys;
  contentType: string;
}): DecryptedFioRecordContent => {
  const { content, payerFioPublicKey, payeeFioPublicKey } = data;
  const { private: privateWalletKey, public: publicWalletKey } = walletKeys;
  const textDecoder = new TextDecoder();
  const textEncoder = new TextEncoder();
  const publicKey =
    payerFioPublicKey === publicWalletKey
      ? payeeFioPublicKey
      : payerFioPublicKey;

  const cipher = Fio.createSharedCipher({
    privateKey: privateWalletKey,
    publicKey,
    textEncoder,
    textDecoder,
  });
  const result = cipher.decrypt(contentType, content);

  return camelizeObjKeys(result);
};

export const getObjKeyByValue = (object: AnyObject, value: string): string => {
  return Object.keys(object).find(key => object[key] === value);
};
