const FIO_DAPP_USERNAME_DELIMITER = '_fio.dapp_';

export function compose(...funcs) {
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

export function emailToUsername(email) {
  if (email && email.indexOf('@') > 0) {
    const [name, domain] = email.split('@');
    // return name
    return `${name}${FIO_DAPP_USERNAME_DELIMITER}${domain}`;
  }

  return '';
}

export function usernameToEmail(username) {
  if (username && username.indexOf(FIO_DAPP_USERNAME_DELIMITER) > 0) {
    const [name, domain] = username.split(FIO_DAPP_USERNAME_DELIMITER);
    // return name
    return `${name}@${domain}`;
  }

  return '';
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const setDataMutator = (args, state) => {
  const [name, data] = args;
  const field = state.fields[name];

  if (field) {
    field.data = { ...field.data, ...data };
  }
};

export const setFreeCart = ({ domains, cart }) => {
  const recalcElem = cart.find(
    item =>
      item.address &&
      item.domain &&
      domains.some(domain => domain.domain === item.domain && domain.free),
  );
  if (recalcElem) {
    delete recalcElem.costFio;
    delete recalcElem.costUsdc;

    const retCart = cart.map(item => {
      delete item.showBadge;
      return item.id === recalcElem.id ? recalcElem : item;
    });
    return retCart;
  } else {
    return cart;
  }
};

export const recalculateCart = ({ domains, cart, id }) => {
  const deletedElement = cart.find(item => item.id === id);
  if (!deletedElement) return;

  const data = {
    id,
  };

  const deletedElemCart = cart.filter(item => item.id !== id);

  if (!deletedElement.costUsdc && !deletedElement.costFio) {
    const recCart = setFreeCart({ domains, cart: deletedElemCart });
    data['cart'] = recCart;
  }

  return data;
};

export const removeFreeCart = ({ cart, prices }) => {
  const {
    fio: { address: addressFio },
    usdt: { address: addressUsdc },
  } = prices;

  const retCart = cart.map(item => {
    if (!item.costFio && !item.costUsdc) {
      item.costFio = addressFio;
      item.costUsdc = addressUsdc;
      item.showBadge = true;
    }
    return item;
  });
  return retCart;
};

export const cartHasFreeItem = cart => {
  return cart.some(item => !item.costFio && !item.costUsdc);
};
