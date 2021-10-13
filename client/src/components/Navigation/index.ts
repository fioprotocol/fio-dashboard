import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Navigation } from './Navigation';

import {
  refProfileInfo,
  loading as refProfileLoading,
} from '../../redux/refProfile/selectors';
import { isActiveUser } from '../../redux/profile/selectors';

const selector = createStructuredSelector({
  isActiveUser,
  refProfileInfo,
  refProfileLoading,
});

export default connect(selector)(Navigation);
