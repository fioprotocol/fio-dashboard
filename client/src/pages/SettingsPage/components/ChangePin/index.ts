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
import { edgeUsername } from '../../../../redux/profile/selectors';

import ChangePin from './ChangePin';

const reduxConnect = connect(
  createStructuredSelector({
    results: changePinResults,
    loading,
    username: edgeUsername,
    changePinError,
  }),
  {
    changePin,
    clearChangePinResults,
    clearChangePinError,
  },
);

export default compose(reduxConnect)(ChangePin);
