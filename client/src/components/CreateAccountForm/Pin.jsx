import React, { Component } from 'react';
import { Field } from 'react-final-form';

import FormHeader from '../FormHeader/FormHeader';
import Input from '../Input/Input';

import classes from './CreateAccountForm.module.scss';

export default class Pin extends Component {
  constructor(props) {
    super();
    this.state = {}
  }

  render() {
    const { isConfirm, loading } = this.props;

    if (isConfirm) return (
      <>
        <FormHeader
          title='Confirm PIN'
          isDoubleColor
          header='Set 2 of 2'
          subtitle='Enter a 6 digit PIN to use for sign in and transaction approvals'
        />
        <Field name='confirmPin' component={Input} disabled={loading}/>
      </>
    )

    return (
      <>
        <FormHeader
          title='Enter PIN'
          isDoubleColor
          header='Set 2 of 2'
          subtitle='Enter a 6 digit PIN to use for sign in and transaction approvals'
        />
        <Field name='pin' component={Input} disabled={loading}/>
      </>
    );
  }
}
