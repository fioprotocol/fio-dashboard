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

export const recalculateCart = ({ domains, cart, id }) => {
  const deletedElement = cart.find(item => item.id === id);
  if (!deletedElement) return;

  const data = {
    id,
  };

  const recalculate = () => {
    const deletedElemCart = cart.filter(item => item.id !== id);
    const recalcElem = deletedElemCart.find(
      item =>
        item.address &&
        item.domain &&
        domains.some(domain => domain.domain === item.domain && domain.free),
    );
    if (recalcElem) {
      delete recalcElem.costFio;
      delete recalcElem.costUsdc;
      const retCart = deletedElemCart.map(item =>
        item.id === recalcElem.id ? recalcElem : item,
      );
      return retCart;
    }

    return deletedElemCart;
  };

  if (!deletedElement.costUsdc && !deletedElement.costFio) {
    const recCart = recalculate({ domains, cart, id });
    data['cart'] = recCart;
  }

  return data;
};
