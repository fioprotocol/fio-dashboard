import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { showPinModal, showGenericErrorModal } from '../../redux/modal/actions';
import { resetPinConfirm } from '../../redux/edge/actions';

import { showPinConfirm } from '../../redux/modal/selectors';
import { confirmingPin, pinConfirmation } from '../../redux/edge/selectors';

import EdgeConfirmAction from './EdgeConfirmAction';

const reduxConnect = connect(
  createStructuredSelector({
    confirmingPin,
    pinConfirmation,
    pinModalIsOpen: showPinConfirm,
  }),
  { showPinModal, resetPinConfirm, showGenericErrorModal },
);

export default compose(reduxConnect)(EdgeConfirmAction);
