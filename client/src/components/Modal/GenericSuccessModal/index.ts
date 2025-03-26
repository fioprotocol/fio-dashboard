import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../../utils';

import {
  closeGenericSuccessModal,
  clearGenericSuccessData,
} from '../../../redux/modal/actions';
import {
  genericSuccessData,
  showGenericSuccess,
} from '../../../redux/modal/selectors';

import GenericSuccessModal from './GenericSuccessModal';

const reduxConnect = connect(
  createStructuredSelector({
    genericSuccessData,
    showGenericSuccess,
  }),
  {
    closeGenericSuccessModal,
    clearGenericSuccessData,
  },
);

export default compose(reduxConnect)(GenericSuccessModal);
