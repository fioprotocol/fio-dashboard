import React, { Component } from 'react';
import { sleep } from '../../utils';

import FormHeader from '../FormHeader/FormHeader';
import classes from './CreateAccountForm.module.scss';

import logoAnimation from './logo-animation.json';

const MIN_WAIT_TIME = 3000;

export default class Success extends Component {
  t0 = null;
  componentDidMount() {
    this.t0 = performance.now();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!prevProps.signupSuccess && this.props.signupSuccess) {
      this.handleComplete();
    }
  }

  handleComplete = async () => {
    const t1 = performance.now();
    if (t1 - this.t0 < MIN_WAIT_TIME) {
      await sleep(MIN_WAIT_TIME - (t1 - this.t0));
    }
    this.props.onFinish();
  };

  render() {
    return (
      <FormHeader
        header={
          <div className={classes.logoAnimation}>
            <lottie-player
              id="logo-loading"
              autoplay
              loop
              mode="normal"
              src={JSON.stringify(logoAnimation)}
            ></lottie-player>
          </div>
        }
        title="Great job!"
        subtitle="Hang tight while we create and secure your account"
        isSubNarrow
      />
    );
  }
}
