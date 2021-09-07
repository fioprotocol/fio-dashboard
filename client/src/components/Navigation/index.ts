import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
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

export default withRouter(connect(selector)(Navigation));
