import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';

import { hideUser } from '../../redux/users/actions';
import { list, selected } from '../../redux/users/selectors';
import UserInfo from './UserInfo';

const user = createSelector([selected, list], (id, l) =>
  l.find(u => u.id === id),
);

const selector = createStructuredSelector({
  user,
});

const actions = { hideUser };

export { UserInfo };

export default connect(selector, actions)(UserInfo);
