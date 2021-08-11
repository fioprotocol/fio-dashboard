import {
  addEdgeCorePlugins,
  lockEdgeCorePlugins,
  makeEdgeContext,
} from 'edge-core-js';
import plugins from 'edge-currency-accountbased';

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

  account() {
    //
  }

  getCachedUsers() {
    try {
      return this.edgeContext.listUsernames();
    } catch (e) {
      console.log(e);
    }
  }

  clearCachedUser(username) {
    try {
      return this.edgeContext.deleteLocalAccount(username);
    } catch (e) {
      console.log(e);
    }
  }

  login(username, password) {
    // returns EdgeAccount
    try {
      return this.edgeContext.loginWithPassword(username, password);
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

  async logout() {
    //
  }
}
