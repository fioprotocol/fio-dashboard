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

export default class Edge {
  edgeContext: EdgeContext;

  makeEdgeContext = async () => {
    try {
      if (this.edgeContext) return true;

      this.edgeContext = await makeEdgeContext({
        apiKey: process.env.REACT_APP_EDGE_LOGIN_API_KEY,
        appId: process.env.REACT_APP_EDGE_LOGIN_API_ID,
        hideKeys: false,
        plugins: { fio: true },
      });
      addEdgeCorePlugins({
        fio: plugins.fio,
      });
      lockEdgeCorePlugins();
      return true;
    } catch (e) {
      console.error(e);
    }

    return false;
  };

  getCachedUsers() {
    try {
      return this.edgeContext.listUsernames();
    } catch (e) {
      console.error(e);
    }
  }

  clearCachedUser(username: string) {
    try {
      return this.edgeContext.deleteLocalAccount(username);
    } catch (e) {
      console.error(e);
    }
  }

  login(
    username: string,
    password: string,
    options: EdgeAccountOptions = {},
  ): Promise<EdgeAccount> {
    // returns EdgeAccount
    try {
      return this.edgeContext.loginWithPassword(username, password, options);
    } catch (e) {
      console.error(e);
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
      const account: EdgeAccount = await this.edgeContext.loginWithPIN(
        username,
        pin,
      );
      return account;
    } catch (e) {
      console.error(e);
      throw e;
      // if (error.wait > 0) {
      //   const currentWaitSpan = error.wait
      //   const reEnableLoginTime = Date.now() + currentWaitSpan * 1000
      //   enableTimer(reEnableLoginTime, t('string_password'), dispatch, t)
      // }
    }
  }

  async checkPasswordRules(password: string, passwordRepeat: string) {
    // check password rules
    const check = await this.edgeContext.checkPasswordRules(password);
    if (!check.passed) {
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
    return this.edgeContext.createAccount(username, password, pin, {});
  }

  async loginMessages(): Promise<EdgeLoginMessages> {
    try {
      return await this.edgeContext.fetchLoginMessages();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  usernameAvailable(username: string): Promise<boolean> {
    return this.edgeContext.usernameAvailable(username); // returns bool `available`
  }

  async getRecoveryQuestions() {
    const results = await this.edgeContext.listRecoveryQuestionChoices();
    return results.filter((result: any) => result.category === 'recovery2');
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
          throw new Error('New password not set');
        }
      }
      return results;
    } catch (e) {
      console.error(e);
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
      console.error(e);
      throw e;
    }
  }

  async checkRecoveryQuestions(username: string): Promise<boolean> {
    if (this.edgeContext) {
      try {
        const token = await this.getToken(username);

        return !!token;
      } catch (e) {
        console.error(e);
      }
    }
  }

  async getToken(username: string): Promise<string> {
    try {
      const localUser = this.edgeContext.localUsers.find(
        ({ username: localUsername }) => localUsername === username,
      );
      return localUser.recovery2Key;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async disableRecovery(account: EdgeAccount): Promise<{ status: number }> {
    try {
      await account.deleteRecovery();
      return { status: 1 };
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getUsersRecoveryQuestions(
    token: string,
    username: string,
  ): Promise<string[]> {
    try {
      return await this.edgeContext.fetchRecovery2Questions(token, username);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async loginWithRecovery(
    token: string,
    username: string,
    answers: string[],
  ): Promise<EdgeAccount> {
    try {
      return this.edgeContext.loginWithRecovery2(token, username, answers);
    } catch (e) {
      console.error(e);
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
      await account.changePassword(password);
      await account.logout();
      return { status: 1 };
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async enableTwoFactorAuth(account: EdgeAccount): Promise<{ status: number }> {
    try {
      await account.enableOtp();
      return { status: 1 };
    } catch (e) {
      console.error(e);
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
      console.error(e);
      throw e;
    }
  }
}
