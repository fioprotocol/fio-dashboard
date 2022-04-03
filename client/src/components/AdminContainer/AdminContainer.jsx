import { Component } from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { Link, Redirect } from 'react-router-dom';

import { ROUTES } from '../../constants/routes';

export default class AdminContainer extends Component {
  static propTypes = exact({
    isAdmin: PropTypes.bool,
  });

  render() {
    const { isAdmin } = this.props;
    if (!isAdmin) {
      return <Redirect to={{ pathname: ROUTES.HOME }} />;
    }

    return (
      <div>
        <Link to={ROUTES.ADMIN_USERS}>Users</Link>
      </div>
    );
  }
}
