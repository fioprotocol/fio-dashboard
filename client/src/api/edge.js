import {
  addEdgeCorePlugins,
  lockEdgeCorePlugins,
  makeEdgeContext,
} from 'edge-core-js';
import plugins from 'edge-currency-accountbased';

import { HandleClearCachedUser } from './middleware/edge';

export default class Edge {
  edgeContext;

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
      console.log(e);
    }
  }

  clearCachedUser(username, force = false) {
    try {
      return HandleClearCachedUser(
        () => this.edgeContext.deleteLocalAccount(username),
        force,
      );
    } catch (e) {
      console.log(e);
    }
  }

  login(username, password, options = {}) {
    // returns EdgeAccount
    try {
      return this.edgeContext.loginWithPassword(username, password, options);
    } catch (e) {
      console.log(e);
      throw e;
      // todo:
      // if (error.wait > 0) {
      //   const currentWaitSpan = error.wait
      //   const reEnableLoginTime = Date.now() + currentWaitSpan * 1000
      //   enableTimer(reEnableLoginTime, t('string_password'), dispatch, t)
      // }
    }
  }

  async loginPIN(username, pin) {
    try {
      const account = await this.edgeContext.loginWithPIN(username, pin);
      return account;
    } catch (e) {
      console.log(e);
      throw e;
      // if (error.wait > 0) {
      //   const currentWaitSpan = error.wait
      //   const reEnableLoginTime = Date.now() + currentWaitSpan * 1000
      //   enableTimer(reEnableLoginTime, t('string_password'), dispatch, t)
      // }
    }
  }

  async checkPasswordRules(password, passwordRepeat) {
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

  async signup(username, password, pin) {
    // create account
    return this.edgeContext.createAccount(username, password, pin, {});
  }

  async loginMessages() {
    try {
      return await this.edgeContext.fetchLoginMessages();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  usernameAvailable(username) {
    return this.edgeContext.usernameAvailable(username); // returns bool `available`
  }

  async getRecoveryQuestions() {
    const results = await this.edgeContext.listRecoveryQuestionChoices();
    return results.filter(result => result.category === 'recovery2');
  }

  confirm(hash) {
    //
  }

  resetPassword(email) {
    //
  }

  setPassword(hash, password, confirmPassword) {
    //
  }

  async changePassword(password, newPassword, username) {
    try {
      const account = await this.login(username, password);
      const results = {};
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
      console.log(e);
      throw e;
    }
  }

  async changePin(pin, password, username) {
    try {
      const account = await this.login(username, password);
      const results = {};
      if (account) {
        const changePinResult = await account.changePin({ pin });
        if (changePinResult) {
          results.status = 1;
        }
        await account.logout();
      }
      return results;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async logout() {
    //
  }

  async checkRecoveryQuestions(username) {
    if (this.edgeContext) {
      return await this.edgeContext
        .getRecovery2Key(username)
        .then(res => res)
        .catch(e => {
          console.log(e);
          return false;
        });
    }
  }

  async getToken(username) {
    try {
      return await this.edgeContext.getRecovery2Key(username);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async disableRecovery(account) {
    try {
      await account.deleteRecovery();
      return { status: 1 };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getUsersRecoveryQuestions(token, username) {
    try {
      return await this.edgeContext.fetchRecovery2Questions(token, username);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async loginWithRecovery(token, username, answers) {
    try {
      return this.edgeContext.loginWithRecovery2(token, username, answers);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async recoveryAccount(token, username, answers, password) {
    try {
      const account = await this.loginWithRecovery(token, username, answers);
      await account.changePassword(password);
      await account.logout();
      return { status: 1 };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async enableTwoFactorAuth(account) {
    try {
      await account.enableOtp();
      return { status: 1 };
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async disableTwoFactorAuth(account) {
    try {
      await account.disableOtp();
      return { status: 1 };
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
