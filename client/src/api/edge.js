import { makeEdgeContext } from 'edge-core-js';
import { addEdgeCorePlugins, lockEdgeCorePlugins } from 'edge-core-js';
import plugins from 'edge-currency-accountbased';

export default class Edge {
  edgeContext;

  makeEdgeContext = async () => {
    try {
      // const options = { // EdgeUiContextOptions
      //   assetsPath: '/login-window/index.html',
      //   vendorImageUrl: logo, // '../assets/images/logo.png'
      //   vendorName: 'FIO'
      // }

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
      console.log(e);
    }
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

  loginPIN(username, pin) {
    try {
      return this.edgeContext.loginWithPIN(username, pin);
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
    try {
      const check = await this.edgeContext.checkPasswordRules(password);
      if (!check.passed) {
        throw new Error('Password is not valid');
      }
      if (password !== passwordRepeat) {
        throw new Error('Passwords is not match');
      }
    } catch (e) {
      throw e;
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

  getRecoveryQuestions() {
    return this.edgeContext.listRecoveryQuestionChoices();
    // .then(results => {
    //   const questions = results
    //     .filter(result => result.category === 'recovery2')
    //     .map(result => result.question)
    //   dispatch(action.setPasswordRecoveryQuestions(questions))
    //   dispatch(action.closeLoadingQuestions())
    // })
    // .catch(error => {
    //   dispatch(openNotification(error.name))
    //   dispatch(action.closeLoadingQuestions())
    // })
  }

  // async setRecovery(questions, answers) {
  //   if (answers[0].length > 3 && answers[1].length > 3) {
  //     const token = await account.changeRecovery(questions, answers)
  //   }
  //   throw new Error('There was an issue setting recovery questions')
  // }

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
