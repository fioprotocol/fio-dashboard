import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { Navigation } from './Navigation';

import { isContainedFlow } from '../../redux/containedFlow/selectors';
import {
  isNotActiveUser,
  isNotActiveAdminUser,
  isSuperAdmin,
  isAffiliateEnabled,
} from '../../redux/profile/selectors';

const selector = createStructuredSelector({
  isNotActiveUser,
  isContainedFlow,
  isNotActiveAdminUser,
  isSuperAdmin,
  isAffiliateEnabled,
});

export default connect(selector)(Navigation);
