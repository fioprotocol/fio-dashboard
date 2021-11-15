import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../../../../utils';

import { loading } from '../../../../../redux/edge/selectors';
import { showGenericError } from '../../../../../redux/modal/selectors';

import ResendEmail from './ResendEmail';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    genericErrorIsShowing: showGenericError,
  }),
);

export default compose(reduxConnect)(ResendEmail);
