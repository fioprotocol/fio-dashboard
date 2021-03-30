import { connect } from 'react-redux';
import AdminContainer from './AdminContainer';
import { isAdmin } from '../../redux/profile/selectors';
import { createStructuredSelector } from 'reselect';

const selector = createStructuredSelector({
  isAdmin,
});

export default connect(selector, null)(AdminContainer);
