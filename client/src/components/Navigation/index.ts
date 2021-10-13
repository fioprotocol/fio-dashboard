import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Navigation } from './Navigation';

import {
  refProfileInfo,
  loading as refProfileLoading,
} from '../../redux/refProfile/selectors';

const selector = createStructuredSelector({
  refProfileInfo,
  refProfileLoading,
});

export default connect(selector)(Navigation);
