import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { Navigation } from './Navigation';

import { isContainedFlow } from '../../redux/containedFlow/selectors';
import {
  isNotActiveUser,
  isNotActiveAdminUser,
  isSuperAdmin,
} from '../../redux/profile/selectors';

const selector = createStructuredSelector({
  isNotActiveUser,
  isContainedFlow,
  isNotActiveAdminUser,
  isSuperAdmin,
});

export default connect(selector)(Navigation);
