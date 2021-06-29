import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { compose } from '../../utils';

import { isAuthenticated } from '../../redux/profile/selectors';

import HomePage from './HomePage';

const reduxConnect = connect(
  createStructuredSelector({
    isAuthenticated,
  }),
  {},
);

export { HomePage };

export default withRouter(compose(reduxConnect)(HomePage));
