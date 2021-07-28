import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { refreshBalance } from '../../redux/fio/actions';

import { isProcessing } from '../../redux/registrations/selectors';
import { fioWallets, loading } from '../../redux/fio/selectors';

import { AddressDomainTransferContainer } from './AddressDomainTransferContainer';

const formConnect = reduxForm({
  form: 'transfer',
  getFormState: state => state.reduxForm,
});

const feePrice = () => ({ costFio: 45.0, costUsdc: 1.0 }); //todo: get real fee data

const reduxConect = connect(
  createStructuredSelector({ feePrice, fioWallets, isProcessing, loading }),
  { refreshBalance },
);

export default compose(
  reduxConect,
  formConnect,
)(AddressDomainTransferContainer);
