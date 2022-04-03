import {
  addEdgeCorePlugins,
  lockEdgeCorePlugins,
  makeEdgeContext,
} from 'edge-core-js';
import plugins from 'edge-currency-accountbased';
import {
  EdgeAccount,
  EdgeAccountOptions,
  EdgeContext,
  EdgeLoginMessages,
} from 'edge-core-js/lib/types';

import { log } from '../util/general';

const NO_EDGE_CONTEXT_MESSAGE = 'Edge Context is not initialised';

export default class Edge {
  edgeContext: EdgeContext | null;

  logError = (e: Error | string) => {
    log.error(e);
  };

  validateEdgeContext = () => {
    if (!this.edgeContext) throw new Error(NO_EDGE_CONTEXT_MESSAGE);
  };

  makeEdgeContext = async (): Promise<boolean> => {
    try {
      if (this.edgeContext) return true;

      this.edgeContext = await makeEdgeContext({
        apiKey: process.env.REACT_APP_EDGE_LOGIN_API_KEY || '',
        appId: process.env.REACT_APP_EDGE_LOGIN_API_ID || '',
        hideKeys: false,
        plugins: { fio: true },
      });
      addEdgeCorePlugins({
        fio: plugins.fio,
      });
      lockEdgeCorePlugins();
      return true;
    } catch (e) {
      this.logError(e);
    }

    return false;
  };

  getCachedUsers(): Promise<string[]> {
    try {
      this.validateEdgeContext();
      return this.edgeContext.listUsernames();
    } catch (e) {
      this.logError(e);
    }
  }

  clearCachedUser(username: string): Promise<void> {
    try {
      this.validateEdgeContext();
      return this.edgeContext.deleteLocalAccount(username);
    } catch (e) {
      this.logError(e);
    }
  }

  login(
    username: string,
    password: string,
    options: EdgeAccountOptions = {},
  ): Promise<EdgeAccount> {
    // returns EdgeAccount
    try {
      this.validateEdgeContext();
      return this.edgeContext.loginWithPassword(username, password, options);
    } catch (e) {
      this.logError(e);
      throw e;
      // todo:
      // if (error.wait > 0) {
      //   const currentWaitSpan = error.wait
      //   const reEnableLoginTime = Date.now() + currentWaitSpan * 1000
      //   enableTimer(reEnableLoginTime, t('string_password'), dispatch, t)
      // }
    }
  }

  async loginPIN(username: string, pin: string): Promise<EdgeAccount> {
    try {
      this.validateEdgeContext();
      const account: EdgeAccount = await this.edgeContext.loginWithPIN(
        username,
        pin,
      );
      return account;
    } catch (e) {
      this.logError(e);
      throw e;
      // if (error.wait > 0) {
      //   const currentWaitSpan = error.wait
      //   const reEnableLoginTime = Date.now() + currentWaitSpan * 1000
      //   enableTimer(reEnableLoginTime, t('string_password'), dispatch, t)
      // }
    }
  }

  checkPasswordRules(password: string, passwordRepeat: string): boolean {
    this.validateEdgeContext();
    // check password rules
    const check = this.edgeContext.checkPasswordRules(password);
    if (!check?.passed) {
      throw new Error('Password is not valid');
    }
    if (password !== passwordRepeat) {
      throw new Error('Passwords is not match');
    }

    return true;
  }

  async signup(
    username: string,
    password: string,
    pin: string,
  ): Promise<EdgeAccount> {
    // create account
    try {
      this.validateEdgeContext();
      return this.edgeContext.createAccount(username, password, pin, {});
    } catch (e) {
      this.logError(e);
      throw e;
    }
  }

  async loginMessages(): Promise<EdgeLoginMessages> {
    try {
      this.validateEdgeContext();
      return await this.edgeContext.fetchLoginMessages();
    } catch (e) {
      this.logError(e);
      throw e;
    }
  }

  usernameAvailable(username: string): Promise<boolean> {
    try {
      this.validateEdgeContext();
      return this.edgeContext.usernameAvailable(username); // returns bool `available`
    } catch (e) {
      this.logError(e);
      throw e;
    }
  }

  async getRecoveryQuestions(): Promise<
    { category: string; question: string }[]
  > {
    try {
      this.validateEdgeContext();
      const results = await this.edgeContext.listRecoveryQuestionChoices();
      return results.filter(
        (result: { category: string; question: string }) =>
          result.category === 'recovery2',
      );
    } catch (e) {
      this.logError(e);
      throw e;
    }
  }

  async changePassword(
    password: string,
    newPassword: string,
    username: string,
  ): Promise<{ status?: number }> {
    try {
      const account = await this.login(username, password);
      const results: { status?: number } = {};
      if (account) {
        await account.changePassword(newPassword);

        // change password method doesn't return anything, so to be sure that password was successfully changed we call checkPassword method
        const isNewPasswordSet = await account.checkPassword(newPassword);

        await account.logout();

        if (isNewPasswordSet) {
          results.status = 1;
        } else {
          results.status = 0;
        }
      }
      return results;
    } catch (e) {
      this.logError(e);
      throw e;
    }
  }

  async changePin(
    pin: string,
    password: string,
    username: string,
  ): Promise<{ status?: number }> {
    try {
      const account = await this.login(username, password);
      const results: { status?: number } = {};
      if (account) {
        const changePinResult = await account.changePin({ pin });
        if (changePinResult) {
          results.status = 1;
        }
        await account.logout();
      }
      return results;
    } catch (e) {
      this.logError(e);
      throw e;
    }
  }

  async checkRecoveryQuestions(username: string): Promise<boolean | undefined> {
    try {
      this.validateEdgeContext();
      const token = await this.getToken(username);
      return !!token;
    } catch (e) {
      this.logError(e);
      // todo: check is `throw e` needed here
    }
  }

  async getToken(username: string): Promise<string> {
    try {
      this.validateEdgeContext();
      const localUser = this.edgeContext.localUsers.find(
        ({ username: localUsername }: { username: string }) =>
          localUsername === username,
      );
      if (localUser?.recovery2Key) return localUser.recovery2Key;
    } catch (e) {
      this.logError(e);
      throw e;
    }

    throw new Error('No recovery key found');
  }

  async disableRecovery(account: EdgeAccount): Promise<{ status: number }> {
    try {
      await account.deleteRecovery();
      return { status: 1 };
    } catch (e) {
      this.logError(e);
      throw e;
    }
  }

  async getUsersRecoveryQuestions(
    token: string,
    username: string,
  ): Promise<string[]> {
    try {
      this.validateEdgeContext();
      return await this.edgeContext.fetchRecovery2Questions(token, username);
    } catch (e) {
      this.logError(e);
      throw e;
    }
  }

  async loginWithRecovery(
    token: string,
    username: string,
    answers: string[],
  ): Promise<EdgeAccount> {
    try {
      this.validateEdgeContext();
      return this.edgeContext.loginWithRecovery2(token, username, answers);
    } catch (e) {
      this.logError(e);
      throw e;
    }
  }

  async recoveryAccount(
    token: string,
    username: string,
    answers: string[],
    password: string,
  ): Promise<{ status: number }> {
    try {
      const account = await this.loginWithRecovery(token, username, answers);
      if (account) {
        await account.changePassword(password);
        await account.logout();
        return { status: 1 };
      }
    } catch (e) {
      this.logError(e);
      throw e;
    }

    throw new Error('No account found');
  }

  async enableTwoFactorAuth(account: EdgeAccount): Promise<{ status: number }> {
    try {
      await account.enableOtp();
      return { status: 1 };
    } catch (e) {
      this.logError(e);
      throw e;
    }
  }

  async disableTwoFactorAuth(
    account: EdgeAccount,
  ): Promise<{ status: number }> {
    try {
      await account.disableOtp();
      return { status: 1 };
    } catch (e) {
      this.logError(e);
      throw e;
    }
  }
}
