import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';

import { isAdmin } from '../../redux/profile/selectors';

import AdminContainer from './AdminContainer';

const selector = createStructuredSelector({
  isAdmin,
});

export default connect(selector, null)(AdminContainer);
