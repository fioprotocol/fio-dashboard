import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { Navigation } from './Navigation';

import {
  refProfileInfo,
  loading as refProfileLoading,
} from '../../redux/refProfile/selectors';
import { isNotActiveUser } from '../../redux/profile/selectors';

const selector = createStructuredSelector({
  isNotActiveUser,
  refProfileInfo,
  refProfileLoading,
});

export default connect(selector)(Navigation);
