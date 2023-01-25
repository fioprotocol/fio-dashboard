import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { Navigation } from './Navigation';

import { isNotActiveAdminUser } from '../../../redux/profile/selectors';

const selector = createStructuredSelector({
  isNotActiveAdminUser,
});

export default connect(selector)(Navigation);
