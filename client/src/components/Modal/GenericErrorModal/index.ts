import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../../utils';

import {
  closeGenericErrorModal,
  clearGenericErrorData,
} from '../../../redux/modal/actions';
import {
  genericErrorData,
  showGenericError,
} from '../../../redux/modal/selectors';

import GenericErrorModal from './GenericErrorModal';

const reduxConnect = connect(
  createStructuredSelector({
    genericErrorData,
    showGenericError,
  }),
  {
    closeGenericErrorModal,
    clearGenericErrorData,
  },
);

export default compose(reduxConnect)(GenericErrorModal);
