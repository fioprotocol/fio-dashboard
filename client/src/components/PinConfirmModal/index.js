import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';
import {
  loading,
  cachedUsers,
  edgeContextSet,
} from '../../redux/edge/selectors';
import { confirmPin, getCachedUsers } from '../../redux/edge/actions';
import { showPinConfirm } from '../../redux/modal/selectors';
import { closeLoginModal as onClose } from '../../redux/modal/actions';

import PinConfirmModal from './PinConfirmModal';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    edgeContextSet,
    showPinConfirm,
    cachedUsers,
  }),
  {
    onSubmit: confirmPin,
    onClose,
    getCachedUsers,
  },
);

export default compose(reduxConnect)(PinConfirmModal);
