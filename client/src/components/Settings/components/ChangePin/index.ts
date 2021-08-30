import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../../../utils';

import { changePin } from '../../../../redux/edge/actions';
import { changePinResults, loading } from '../../../../redux/edge/selectors';

import ChangePin from './ChangePin';

const reduxConnect = connect(
  createStructuredSelector({
    results: changePinResults,
    loading,
  }),
  { changePin },
);

export default compose(reduxConnect)(ChangePin);
