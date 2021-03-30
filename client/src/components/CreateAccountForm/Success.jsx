import React, { Component } from 'react';

import FormHeader from '../FormHeader/FormHeader';
import classes from './CreateAccountForm.module.scss';

export default class Pin extends Component {
  componentDidMount() {
    setTimeout(this.props.redirect, 3000);
  }

  render() {
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
