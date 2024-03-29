import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { showPinModal, showGenericErrorModal } from '../../redux/modal/actions';
import { resetPinConfirm, setConfirmPinKeys } from '../../redux/edge/actions';
import { fioActionExecuted } from '../../redux/fio/actions';

import { showPinConfirm } from '../../redux/modal/selectors';
import {
  confirmingPin,
  pinConfirmation,
  confirmPinKeys,
} from '../../redux/edge/selectors';

import EdgeConfirmAction from './EdgeConfirmAction';

const reduxConnect = connect(
  createStructuredSelector({
    confirmingPin,
    pinConfirmation,
    pinModalIsOpen: showPinConfirm,
    confirmPinKeys,
  }),
  {
    showPinModal,
    resetPinConfirm,
    showGenericErrorModal,
    setConfirmPinKeys,
    fioActionExecuted,
  },
);

export default compose(reduxConnect)(EdgeConfirmAction);
