import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import PropTypes from 'prop-types';

import ResetPasswordForm from '../../components/ResetPasswordForm';

export default class ResetPasswordPage extends Component {
  static propTypes = {
    isChangedPwd: PropTypes.bool.isRequired,
    match: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  onSubmitChangePwd = data => {
    const {
      match: {
        params: { hash },
      },
    } = this.props;
    this.props.onSubmit({ ...data, hash });
  };

  render() {
    const {
      isChangedPwd,
      match: {
        params: { hash },
      },
    } = this.props;

    return (
      <div>
        {hash && !isChangedPwd && (
          <ResetPasswordForm onSubmit={this.onSubmitChangePwd} />
        )}
        {isChangedPwd && (
          <span>
            Your password successfully changed!
            <Link to={ROUTES.LOGIN}>Go to login page</Link>
          </span>
        )}
      </div>
    );
  }
}
