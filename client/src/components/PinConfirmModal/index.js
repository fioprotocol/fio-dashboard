import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';
import {
  cachedUsers,
  edgeContextSet,
  confirmingPin,
  pinConfirmation,
  username,
} from '../../redux/edge/selectors';
import { confirmPin, getCachedUsers } from '../../redux/edge/actions';
import { showPinConfirm } from '../../redux/modal/selectors';
import { closePinConfirmModal as onClose } from '../../redux/modal/actions';

import PinConfirmModal from './PinConfirmModal';

const reduxConnect = connect(
  createStructuredSelector({
    username,
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
  },
);

export default compose(reduxConnect)(PinConfirmModal);
