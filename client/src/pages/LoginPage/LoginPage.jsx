import React, { Component } from 'react';
// import { makeEdgeContext } from 'edge-core-js'
// import { ethereumCurrencyPluginFactory } from 'edge-currency-ethereum'
import plugins from 'edge-currency-accountbased'

import logo from '../../assets/images/logo.png'
import LoginForm from "../../components/LoginForm";

export default class LoginPage extends Component {
  constructor(props) {
    super(props)

    // if (restoreCachedState(module, this)) return
    this.state = { account: undefined, context: undefined, loading: false }
  }

  componentDidMount() {
    // Make the context:
    // this.makeEdgeContext()
  }

  // makeEdgeContext = async () => {
  //   try {
  //     const options = { // EdgeUiContextOptions
  //       // plugins: {
  //       //   'bitcoin': true,
  //       //   'fio': true,
  //       //   'ethereum': false,
  //       // },
  //       assetsPath: '/login-window/index.html',
  //       vendorImageUrl: logo,
  //       vendorName: 'FIO'
  //     }

  //     // Core context:
  //     const context = await makeEdgeContext({
  //       apiKey: process.env.REACT_APP_EDGE_LOGIN_API_KEY,
  //       appId: process.env.REACT_APP_EDGE_LOGIN_API_ID,
  //       hideKeys: false,
  //       plugins: [ethereumCurrencyPluginFactory]
  //       // plugins: [plugins.fio]
  //     })
  //     context.on('login', account => {
  //       console.log(account);
  //       this.onLoginSuccess(account)
  //     })
  //     context.on('error', e => {
  //       console.error(e);
  //       this.setState({ loading: false })
  //     })
  //     this.setState({ context })
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }


  /**
   * Handles logging in.
   */
  // onLoginSuccess = async (account) => { // EdgeAccount
  //   this.props.setAccount(account)
  // }

  onLoginCB = (data) => {
    this.onLogin(data)
  }
  /**
   * Handles logging in.
   */
  onLogin = async ({ username, password }) => { // EdgeAccount
    // if (!username) return
    // const { context } = this.state
    // this.setState({ loading: true })
    // console.log(context.loginWithPIN);
    // const account = await context.loginWithPIN(username, password)
    // console.log('account==============', account);
    // context.loginWithPassword(username, password)
    // if (error.wait > 0) {
    //   const currentWaitSpan = error.wait
    //   const reEnableLoginTime = Date.now() + currentWaitSpan * 1000
    //   enableTimer(reEnableLoginTime, t('string_password'), dispatch, t)
    // }
  }

  onError = (e) => {
    console.log(e);
  }
  onClose = (e) => {
    console.log(e);
  }

  render() {
    const { context, loading } = this.state
    // if (!context || loading) return <p>Loading...</p>

    return <LoginForm edgeContext={context} onSubmit={this.onLoginCB}/>
  }
}
