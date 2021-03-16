import React, { Component } from 'react';

import LoginForm from "../../components/LoginForm";
import LoginPinForm from "../../components/LoginPinForm";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default class LoginPage extends Component {
  constructor(props) {
    super(props)

    this.state = { loading: false, cachedUsers: [], pinLogin: false }
  }

  componentDidMount() {
    this.checkCachedUsers()
  }

  checkCachedUsers = async () => {
    // const { edgeContext } = this.props;
    // this.setState({ loading: true });
    // try {
    //   const cachedUsers = await edgeContext.listUsernames();
    //   this.setState({ cachedUsers, pinLogin: !!cachedUsers.length });
    // } catch (e) {
    //   console.log(e);
    // }
    // this.setState({ loading: false });
  }

  onLoginSuccess = async (account) => { // EdgeAccount
    this.props.setAccount(account)
  }

  loginPassword = async ({ username, password }) => { // EdgeAccount
    if (!username) return
    const { edgeContext } = this.props
    this.setState({ loading: true })
    try {
      const account = await edgeContext.loginWithPassword(username, password)
      this.onLoginSuccess(account)
    } catch (e) {
      console.log(e);
      // if (error.wait > 0) {
      //   const currentWaitSpan = error.wait
      //   const reEnableLoginTime = Date.now() + currentWaitSpan * 1000
      //   enableTimer(reEnableLoginTime, t('string_password'), dispatch, t)
      // }
    }
    this.setState({ loading: false })
  }

  loginPin = async ({ username, pin }) => { // EdgeAccount
    if (!username) return
    const { edgeContext } = this.props
    this.setState({ loading: true })
    try {
      const account = await edgeContext.loginWithPIN(username, pin)
      this.onLoginSuccess(account)
    } catch (e) {
      console.log(e);
    }
    this.setState({ loading: false })
  }

  exitPin = () => {
    this.setState({ pinLogin: false })
  }

  render() {
    const { edgeContext } = this.props
    const { loading, pinLogin, cachedUsers } = this.state

    return (
      <>
        {loading && <FontAwesomeIcon
          icon={faSpinner}
          spin
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            zIndex: 2,
          }}
        />}

        {pinLogin ? (
          <LoginPinForm edgeContext={edgeContext} onSubmit={this.loginPin} exitPin={this.exitPin} loading={loading} initialValues={{ username: cachedUsers[0] }}/>
        ) : (
          <LoginForm edgeContext={edgeContext} onSubmit={this.loginPassword} loading={loading}/>
        )}
      </>
    )
  }
}
