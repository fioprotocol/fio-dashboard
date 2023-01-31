import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../../utils';

import { closeGenericSuccessModal } from '../../../redux/modal/actions';
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
  },
);

export default compose(reduxConnect)(GenericSuccessModal);
