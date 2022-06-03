import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { Navigation } from './Navigation';

import { isContainedFlow } from '../../redux/containedFlow/selectors';
import { isNotActiveUser } from '../../redux/profile/selectors';

const selector = createStructuredSelector({
  isNotActiveUser,
  isContainedFlow,
});

export default connect(selector)(Navigation);
