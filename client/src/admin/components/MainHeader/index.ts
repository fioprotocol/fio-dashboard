import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';

import { adminLogout, resetLastAuthData } from '../../../redux/profile/actions';
import { locationState, pathname } from '../../../redux/navigation/selectors';
import {
  isAdminAuthenticated,
  loading as profileLoading,
} from '../../../redux/profile/selectors';

import MainHeader from './MainHeader';

import { MainHeaderProps } from './types';
import { AppDispatch } from '../../redux/init';
import { OwnPropsAny } from '../../../types';

const selector = createStructuredSelector({
  pathname,
  isAuthenticated: isAdminAuthenticated,
  profileLoading,
  locationState,
});

const actions = (
  dispatch: AppDispatch,
  ownProps: MainHeaderProps & OwnPropsAny,
) => ({
  logout: () => {
    const { history } = ownProps;
    dispatch(adminLogout({ history }));
    dispatch(resetLastAuthData());
  },
});

export default withRouter(connect(selector, actions)(MainHeader));
