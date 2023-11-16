import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { edgeUsername } from '../../../../redux/profile/selectors';
import { logout, resetLastAuthData } from '../../../../redux/profile/actions';
import {
  closeGenericSuccessModal,
  showGenericSuccessModal,
} from '../../../../redux/modal/actions';
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
      dispatch(logout({ history, redirect: '/?logout=silent' }));
      dispatch(resetLastAuthData());
    },
    closeSuccessModal: () => {
      dispatch(closeGenericSuccessModal());
    },
    showSuccessModal: (message: string, title: string) => {
      dispatch(showGenericSuccessModal(message, title));
    },
  }),
);

export default compose(reduxConnect)(DeleteMyAccount);
