import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { edgeUsername } from '../../../../redux/profile/selectors';
import { logout, resetLastAuthData } from '../../../../redux/profile/actions';
import { compose } from '../../../../utils';

import DeleteMyAccount from './DeleteMyAccount';

import { AppDispatch } from '../../../../redux/init';
import { OwnPropsAny } from '../../../../types';

const reduxConnect = connect(
  createStructuredSelector({
    username: edgeUsername,
  }),
  (dispatch: AppDispatch, ownProps: OwnPropsAny) => ({
    logout: () => {
      const { history } = ownProps;
      dispatch(logout({ history }));
      dispatch(resetLastAuthData());
    },
  }),
);
export default compose(reduxConnect)(DeleteMyAccount);
