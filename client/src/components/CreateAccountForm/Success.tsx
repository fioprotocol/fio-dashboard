import React, { Component } from 'react';

import FioLoader from '../common/FioLoader/FioLoader';

import FormHeader from '../FormHeader/FormHeader';

import { sleep } from '../../utils';

import classes from './CreateAccountForm.module.scss';

const MIN_WAIT_TIME = 3000;

type Props = {
  signupSuccess: boolean;
  onFinish: () => void;
};

export default class Success extends Component<Props> {
  t0: number | null = null;
  componentDidMount(): void {
    this.t0 = performance.now();
  }

  componentDidUpdate(prevProps: Props): void {
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

  render(): React.ReactElement {
    return (
      <FormHeader
        header={
          <div className={classes.logoAnimation}>
            <FioLoader />
          </div>
        }
        title="Great job!"
        subtitle="Hang tight while we create and secure your account"
        isSubNarrow
      />
    );
  }
}
