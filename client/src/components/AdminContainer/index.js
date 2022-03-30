import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';

import AdminContainer from './AdminContainer';
import { isAdmin } from '../../redux/profile/selectors';

const selector = createStructuredSelector({
  isAdmin,
});

export default connect(selector, null)(AdminContainer);
