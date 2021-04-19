import React, { Component } from 'react';

import FormHeader from '../FormHeader/FormHeader';
import classes from './CreateAccountForm.module.scss';

export default class Pin extends Component {
  componentDidMount() {
    const { form } = this.props;
    form.submit();
  }

  render() {
    // const { loading } = this.props; // todo: uncommit on animation ready
    return (
      <FormHeader
        header={<div className={classes.logo} />}
        title="Great job!"
        subtitle="Hang tight while we create and secure your account"
        isSubNarrow
      />
    );
  }
}
