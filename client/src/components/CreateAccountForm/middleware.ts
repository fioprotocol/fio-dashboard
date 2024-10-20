import { EdgeAccount, EdgeCurrencyWallet } from 'edge-core-js';

import apis from '../../api/index';
import { log } from '../../util/general';

import {
  DEFAULT_WALLET_OPTIONS,
  FIO_WALLET_TYPE,
} from '../../constants/common';

type CreateAccountRes = {
  errors: { email?: string; username?: string };
  account?: EdgeAccount;
  fioWallet?: EdgeCurrencyWallet;
};

const createFioWallet = async (account: EdgeAccount) => {
  const fioWallet = await account.createCurrencyWallet(
    FIO_WALLET_TYPE,
    DEFAULT_WALLET_OPTIONS,
  );
  await fioWallet.renameWallet(DEFAULT_WALLET_OPTIONS.name);

  return fioWallet;
};

export const usernameAvailable = async (
  username: string,
): Promise<{ error?: string }> => {
  const result: { error?: string } = {};
  try {
    const res = await apis.edge.usernameAvailable(username);

    if (!res) {
      result.error = 'Not available';
    }
  } catch (e) {
    result.error = e.message;
  }

  return result;
};

export const checkPassword = async (
  password: string,
  passwordRepeat: string,
): Promise<{ error?: string }> => {
  const result: { error?: string } = {};
  try {
    const res = apis.edge.checkPasswordRules(password, passwordRepeat);

    if (!res) {
      result.error = 'Password is invalid';
    }
  } catch (e) {
    result.error = e.message;
  }

  return result;
};

export const checkUsernameAndPassword = async ({
  email,
  username,
  password,
  passwordRepeat,
}: {
  email: string;
  username: string;
  password: string;
  passwordRepeat: string;
}): Promise<{ errors: { email?: string; password?: string } }> => {
  const result: { errors: { email?: string; password?: string } } = {
    errors: {},
  };
  const { error: usernameError } = await usernameAvailable(username);
  const { error: passwordError } = await checkPassword(
    password,
    passwordRepeat,
  );
  const isAbstractEmailVerified = await apis.general.abstractEmailVerification(
    email,
  );

  if (usernameError) {
    result.errors.email = usernameError;
  }
  if (passwordError) {
    result.errors.password = passwordError;
  }
  if (!isAbstractEmailVerified.isValid) {
    result.errors.email = 'Invalid Email Address';
  }

  return result;
};

export const createAccount = async (
  username: string,
  password: string,
): Promise<CreateAccountRes> => {
  const result: CreateAccountRes = { errors: {} };
  try {
    result.account = await apis.edge.signup(username, password);
    result.fioWallet = await createFioWallet(result.account);
  } catch (e) {
    log.error('Create Edge Account Error:', e);
    try {
      result.account && (await result.account.logout());
    } catch (e) {
      log.error(e);
    }
    result.errors = { email: e.message };
  }

  return result;
};
