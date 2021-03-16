import logo from "../assets/images/logo.png";
import { makeEdgeContext } from 'edge-core-js';
import { addEdgeCorePlugins, lockEdgeCorePlugins } from "edge-core-js";
import plugins from "edge-currency-accountbased";

export default class Edge {
  edgeContext
  constructor() {
    this.makeEdgeContext()
  }

  makeEdgeContext = async () => {
    try {
      const options = { // EdgeUiContextOptions
        assetsPath: '/login-window/index.html',
        vendorImageUrl: logo,
        vendorName: 'FIO'
      }

      this.edgeContext = await makeEdgeContext({
        apiKey: process.env.REACT_APP_EDGE_LOGIN_API_KEY,
        appId: process.env.REACT_APP_EDGE_LOGIN_API_ID,
        hideKeys: false,
        plugins: { fio: true }
      })
      addEdgeCorePlugins({
        fio: plugins.fio
      })
      lockEdgeCorePlugins()
    } catch (e) {
      console.log(e);
    }
  }

  account() {
    //
  }

  getCachedUsers() {
    return this.edgeContext.listUsernames()
  }

  login(username, password) { // returns EdgeAccount
    try {
      return this.edgeContext.loginWithPassword(username, password)
    } catch (e) {
      console.log(e);
      throw e
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
      return this.edgeContext.loginWithPIN(username, pin)
    } catch (e) {
      console.log(e);
      throw e
      // if (error.wait > 0) {
      //   const currentWaitSpan = error.wait
      //   const reEnableLoginTime = Date.now() + currentWaitSpan * 1000
      //   enableTimer(reEnableLoginTime, t('string_password'), dispatch, t)
      // }
    }
  }

  signup(data) {
    //
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
