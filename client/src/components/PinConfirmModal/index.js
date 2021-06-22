import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';
import {
  confirmPin,
  getCachedUsers,
  resetPinConfirm,
} from '../../redux/edge/actions';
import { closePinConfirmModal as onClose } from '../../redux/modal/actions';
import {
  cachedUsers,
  edgeContextSet,
  confirmingPin,
  pinConfirmation,
} from '../../redux/edge/selectors';
import { showPinConfirm } from '../../redux/modal/selectors';
import { edgeUsername } from '../../redux/profile/selectors';

import PinConfirmModal from './PinConfirmModal';

const reduxConnect = connect(
  createStructuredSelector({
    username: edgeUsername,
    edgeContextSet,
    showPinConfirm,
    cachedUsers,
    confirmingPin,
    pinConfirmation,
  }),
  {
    onSubmit: confirmPin,
    onClose,
    getCachedUsers,
    resetPinConfirm,
  },
);

export default compose(reduxConnect)(PinConfirmModal);
