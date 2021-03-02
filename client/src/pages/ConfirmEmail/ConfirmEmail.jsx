import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import styles from './ConfirmEmail.module.scss';

class ConfirmEmail extends Component {
  static propTypes = {
    confirm: PropTypes.func.isRequired,
    isConfirmed: PropTypes.bool.isRequired,
    match: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const {
      confirm,
      match: {
        params: { hash },
      },
    } = this.props;
    confirm(hash);
  }

  render() {
    const { isConfirmed } = this.props;

    return (
      <div className={styles.confirmEmailWrap}>
        <div>
          {isConfirmed ? (
            <h3>Your email is verified. Now you can login to system.</h3>
          ) : (
            <h3>Email is not verified.</h3>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(ConfirmEmail);
