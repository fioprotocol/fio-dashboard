import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import SettingsPage from './SettingsPage';

import { compose } from '../../utils';

import { loading, edgeUsername, user } from '../../redux/profile/selectors';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    username: edgeUsername,
    user,
  }),
  {},
);

export default compose(reduxConnect)(SettingsPage);
