export const EMAIL = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

export const ADDRESS_REGEXP = /^[\w\d]*[\w\-\d]*[\w\d]$/;

export const CHAIN_CODE_REGEXP = /^[A-Z0-9]+$/;
export const TOKEN_CODE_REGEXP = /^[A-Z0-9]+$|^\*{1}$/;

export const URL_REGEXP = /\b(https?:\/\/\S*\b)/;

export const WALLET_NAME_REGEX = /^[a-zA-Z0-9\s\-_]{1,32}$/i;

export const testWalletName = (name: string) => {
  if (!WALLET_NAME_REGEX.test(name)) {
    throw new Error(
      'Name is not valid. Name should be from 1 to 32 symbols and contain only letters, digits, spaces, dashes or underscores',
    );
  }

  return true;
};
