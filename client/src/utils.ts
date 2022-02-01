import { EdgeCurrencyWallet } from 'edge-core-js';
import isEmpty from 'lodash/isEmpty';

import {
  CartItem,
  DeleteCartItem,
  Domain,
  Prices,
  FioNameItemProps,
  WalletKeysObj,
} from './types';

const FIO_DASH_USERNAME_DELIMITER = `.fio.dash.${process.env
  .REACT_APP_EDGE_ACC_DELIMITER || ''}`;

export const FIO_ADDRESS_DELIMITER = '@';

export function compose(...funcs: ((args?: any) => any)[]) {
  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}

export function currentYear() {
  const year = new Date().getFullYear();
  const startYear = 2021;
  return year === startYear ? year : `${startYear} - ${year}`;
}

export async function minWaitTimeFunction(
  cb: () => Promise<any>,
  minWaitTime = 1000,
) {
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

export function emailToUsername(email: string) {
  if (email && email.indexOf('@') > 0) {
    const [name, domain] = email.split('@');
    // return name
    return `${name}${FIO_DASH_USERNAME_DELIMITER}${domain}`;
  }

  return '';
}

export const getWalletKeys = (
  fioWallets: EdgeCurrencyWallet[],
): WalletKeysObj => {
  const keys: WalletKeysObj = {};
  for (const fioWallet of fioWallets) {
    keys[fioWallet.id] = {
      private: fioWallet.keys.fioKey,
      public: fioWallet.publicWalletInfo.keys.publicKey,
    };
  }
  return keys;
};

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const setDataMutator = (args: any[], state: any) => {
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
  return domainFromList && domainFromList.free;
};

export const setFreeCart = ({ cartItems }: { cartItems: CartItem[] }) => {
  const recalcElem = cartItems.find(
    item => item.address && item.domain && item.allowFree,
  );
  if (recalcElem) {
    delete recalcElem.costFio;
    delete recalcElem.costUsdc;

    const retCart = cartItems.map(item => {
      delete item.showBadge;
      return item.id === recalcElem.id ? recalcElem : item;
    });
    return retCart;
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
}) => {
  const deletedElement = cartItems.find(item => item.id === id);
  if (!deletedElement) return;

  const data: { id: string; cartItems?: CartItem[] } = {
    id,
  };

  const deletedElemCart = cartItems.filter(item => item.id !== id);

  if (!deletedElement.costUsdc && !deletedElement.costFio) {
    const recCart = setFreeCart({ cartItems: deletedElemCart });
    data.cartItems = recCart;
  }

  return data;
};

export const removeFreeCart = ({
  cartItems,
  prices,
}: {
  cartItems: CartItem[];
  prices: Prices;
}) => {
  const {
    fio: { address: addressFio },
    usdt: { address: addressUsdc },
  } = prices;

  const retCart = cartItems.map(item => {
    if (!item.costFio && !item.costUsdc) {
      item.costFio = addressFio;
      item.costUsdc = addressUsdc;
      item.showBadge = true;
    }
    return item;
  });
  return retCart;
};

export const cartHasFreeItem = (cartItems: CartItem[]) => {
  return (
    !isEmpty(cartItems) &&
    cartItems.some(item => !item.costFio && !item.costUsdc)
  );
};

export const handleFreeAddressCart = ({
  recalculate,
  cartItems,
  prices,
  hasFreeAddress,
}: {
  recalculate: (cartItems: CartItem[]) => {};
  cartItems: CartItem[];
  prices: Prices;
  hasFreeAddress: boolean;
}) => {
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
}: {
  id?: string;
  prices?: Prices;
  deleteItem?: (data: DeleteCartItem | string) => {};
  cartItems?: CartItem[];
  recalculate?: (cartItems: CartItem[]) => {};
} = {}) => {
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
          usdt: { domain: domainPrice, address: addressPrice },
          fio: { domain: fioDomainPrice, address: fioAddressPrice },
        } = prices;
        const retObj = {
          ...firstMatchElem,
          costFio: fioAddressPrice + fioDomainPrice,
          costUsdc: addressPrice + domainPrice,
          hasCustomDomain: true,
        };
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
): { costFio?: number; costUsdc?: number; costFree?: string } => {
  if (cart.length === 1 && cart.some(item => !item.costFio && !item.costUsdc))
    return { costFree: 'FREE' };

  const cost =
    !isEmpty(cart) &&
    cart
      .filter(item => item.costFio && item.costUsdc)
      .reduce<Record<string, number>>((acc, item) => {
        if (!acc.costFio) acc.costFio = 0;
        if (!acc.costUsdc) acc.costUsdc = 0;
        return {
          costFio: acc.costFio + item.costFio,
          costUsdc: acc.costUsdc + item.costUsdc,
        };
      }, {});

  return {
    costFio: (Number.isFinite(cost.costFio) && +cost.costFio.toFixed(2)) || 0,
    costUsdc:
      (Number.isFinite(cost.costUsdc) && +cost.costUsdc.toFixed(2)) || 0,
  };
};

export const isDomain = (fioName: string) =>
  fioName.indexOf(FIO_ADDRESS_DELIMITER) < 0;
export const hasFioAddressDelimiter = (value: string): boolean =>
  value.indexOf(FIO_ADDRESS_DELIMITER) > 0;

export const priceToNumber = (price: string) => +parseFloat(price).toFixed(2);

export const getElementByFioName = ({
  fioNameList,
  name,
}: {
  fioNameList: FioNameItemProps[];
  name: string;
}) => {
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
) => {
  return Object.keys(params).reduce(
    (acc: string, key: string) => acc.replace(`:${key}`, params[key]),
    `${route}`,
  );
};
