import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../../../utils';

import {
  changePin,
  clearChangePinResults,
  clearChangePinError,
} from '../../../../redux/edge/actions';
import {
  changePinResults,
  loading,
  changePinError,
} from '../../../../redux/edge/selectors';

import ChangePin from './ChangePin';
import { ReduxState } from '../../../../types';

const reduxConnect = connect(
  createStructuredSelector({
    results: changePinResults,
    loading,
    username: (state: ReduxState) =>
      state.profile && state.profile.user && state.profile.user.username,
    changePinError,
  }),
  {
    changePin,
    clearChangePinResults,
    clearChangePinError,
  },
);

export default compose(reduxConnect)(ChangePin);
