import { EdgeCurrencyWallet } from 'edge-core-js';
import isEmpty from 'lodash/isEmpty';
import { TextDecoder, TextEncoder } from 'text-encoding';
import { Fio } from '@fioprotocol/fiojs';
import mapKeys from 'lodash/mapKeys';
import camelCase from 'camelcase';

import MathOp from './util/math';

import {
  CartItem,
  DeleteCartItem,
  Domain,
  Prices,
  FioNameItemProps,
  FioRecord,
  ResponseFioRecord,
  WalletKeys,
  EdgeWalletsKeys,
  DecryptedFioRecordContent,
  Unknown,
  AnyObject,
} from './types';
import { convertFioPrices } from './util/prices';

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
    const [name, domain] = email.split('@');
    // return name
    return `${name}${FIO_DASH_USERNAME_DELIMITER}${domain}`;
  }

  return '';
}

export const getWalletKeys = (
  fioWallets: EdgeCurrencyWallet[],
): EdgeWalletsKeys => {
  const keys: EdgeWalletsKeys = {};
  for (const fioWallet of fioWallets) {
    keys[fioWallet.id] = {
      private: fioWallet.keys.fioKey,
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
  const domainFromList = domains.find(item => item.domain === domain);
  return !!domainFromList?.free;
};

export const setFreeCart = ({
  cartItems,
}: {
  cartItems: CartItem[];
}): CartItem[] => {
  const recalcElem = cartItems.find(
    item => item.address && item.domain && item.allowFree,
  );
  if (recalcElem) {
    delete recalcElem.costNativeFio;

    return cartItems.map(item => {
      delete item.showBadge;
      return item.id === recalcElem.id ? recalcElem : item;
    });
  } else {
    return cartItems;
  }
};

export const recalculateCart = ({
  cartItems,
  id,
}: {
  cartItems: CartItem[];
  id: string;
}): { id: string; cartItems?: CartItem[] } => {
  const deletedElement = cartItems.find(item => item.id === id);
  if (!deletedElement) return;

  const data: { id: string; cartItems?: CartItem[] } = {
    id,
  };

  const deletedElemCart = cartItems.filter(item => item.id !== id);

  if (!deletedElement.costNativeFio) {
    data.cartItems = setFreeCart({ cartItems: deletedElemCart });
  }

  return data;
};

export const removeFreeCart = ({
  cartItems,
  prices,
}: {
  cartItems: CartItem[];
  prices: Prices;
}): CartItem[] => {
  const {
    nativeFio: { address: nativeFioAddressPrice },
  } = prices;

  return cartItems.map(item => {
    if (!item.costNativeFio) {
      item.costNativeFio = nativeFioAddressPrice;
      item.showBadge = true;
    }
    return item;
  });
};

export const cartHasFreeItem = (cartItems: CartItem[]): boolean => {
  return !isEmpty(cartItems) && cartItems.some(item => !item.costNativeFio);
};

export const handleFreeAddressCart = ({
  recalculate,
  cartItems,
  prices,
  hasFreeAddress,
}: {
  recalculate: (cartItems: CartItem[]) => void;
  cartItems: CartItem[];
  prices: Prices;
  hasFreeAddress: boolean;
}): void => {
  let retCart: CartItem[] = [];
  if (hasFreeAddress) {
    retCart = removeFreeCart({ cartItems, prices });
  } else if (!cartHasFreeItem(cartItems)) {
    retCart = setFreeCart({ cartItems });
  }
  recalculate(!isEmpty(retCart) ? retCart : cartItems);
};

export const deleteCartItem = ({
  id,
  prices,
  deleteItem,
  cartItems,
  recalculate,
  roe,
}: {
  id?: string;
  prices?: Prices;
  deleteItem?: (data: DeleteCartItem | string) => void;
  cartItems?: CartItem[];
  recalculate?: (cartItems: CartItem[]) => void;
  roe?: number;
} = {}): void => {
  const data = recalculateCart({ cartItems, id }) || id;
  deleteItem(data);

  const { domain, hasCustomDomain } =
    cartItems.find(item => item.id === id) || {};
  const updCart = cartItems.filter(item => item.id !== id);

  if (hasCustomDomain) {
    const hasCurrentDomain =
      domain && updCart.some(item => item.domain === domain.toLowerCase());
    if (hasCurrentDomain) {
      const firstMatchElem =
        domain && updCart.find(item => item.domain === domain.toLowerCase());
      if (!isEmpty(firstMatchElem)) {
        const {
          nativeFio: {
            address: nativeFioAddressPrice,
            domain: nativeFioDomainPrice,
          },
        } = prices || { nativeFio: {} };
        const retObj = {
          ...firstMatchElem,
          costNativeFio: new MathOp(nativeFioAddressPrice)
            .add(nativeFioDomainPrice)
            .toNumber(),
          hasCustomDomain: true,
        };
        const fioPrices = convertFioPrices(retObj.costNativeFio, roe);

        retObj.costFio = fioPrices.fio;
        retObj.costUsdc = fioPrices.usdc;

        const retData = updCart.map(item =>
          item.id === firstMatchElem.id ? retObj : item,
        );

        recalculate(retData);
      }
    }
  }
};

export const totalCost = (
  cart: CartItem[],
  roe: number,
): {
  costNativeFio?: number;
  costFree?: string;
  costFio?: string;
  costUsdc?: string;
} => {
  if (cart.length === 1 && cart.some(item => !item.costNativeFio))
    return { costFree: 'FREE' };

  const cost = isEmpty(cart)
    ? { costNativeFio: 0 }
    : cart
        .filter(item => item.costNativeFio)
        .reduce<Record<string, number>>((acc, item) => {
          if (!acc.costNativeFio) acc.costNativeFio = 0;
          return {
            costNativeFio: new MathOp(acc.costNativeFio)
              .add(item.costNativeFio || 0)
              .toNumber(),
          };
        }, {});

  const fioPrices = convertFioPrices(cost.costNativeFio, roe);

  return {
    costNativeFio: cost.costNativeFio || 0,
    costFio: fioPrices.fio || '0',
    costUsdc: fioPrices.usdc || '0',
  };
};

export const isDomain = (fioName: string): boolean =>
  fioName.indexOf(FIO_ADDRESS_DELIMITER) < 0;
export const hasFioAddressDelimiter = (value: string): boolean =>
  value.indexOf(FIO_ADDRESS_DELIMITER) > 0;

export const priceToNumber = (price: string): number =>
  +parseFloat(price).toFixed(2);

export const getElementByFioName = ({
  fioNameList,
  name,
}: {
  fioNameList: FioNameItemProps[];
  name: string;
}): FioNameItemProps => {
  return (
    (fioNameList &&
      fioNameList.find(
        ({ name: itemName }: FioNameItemProps) => itemName === name,
      )) ||
    {}
  );
};

export const putParamsToUrl = (
  route: string,
  params: { [paramName: string]: string },
): string => {
  return Object.keys(params).reduce(
    (acc: string, key: string) =>
      acc.replace(new RegExp(`:${key}[?]?`, 'g'), params[key]),
    `${route}`,
  );
};

export const camelizeFioRequestsData = (
  data: ResponseFioRecord[],
): FioRecord[] => {
  const result: FioRecord[] = [];
  data.forEach((o: ResponseFioRecord, i: number) => {
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
