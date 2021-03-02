import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PasswordRecoveryForm from '../../components/PasswordRecoveryForm';

export default class PasswordRecoveryPage extends Component {
  static propTypes = {
    isRecoveryRequested: PropTypes.bool.isRequired,
  };

  render() {
    if (this.props.isRecoveryRequested) {
      return <h3>Success, check your email for next step.</h3>;
    }
    return <PasswordRecoveryForm />;
  }
}
