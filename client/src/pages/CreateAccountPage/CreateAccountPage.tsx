import React, { Component } from 'react';

import CreateAccountForm from '../../components/CreateAccountForm';

import classes from './CreateAccountPage.module.scss';

export default class CreateAccountPage extends Component {
  render(): React.ReactElement {
    return (
      <div className={classes.container}>
        <CreateAccountForm />
      </div>
    );
  }
}
