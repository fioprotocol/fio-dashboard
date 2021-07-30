import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../../utils';

import { refreshBalance, transfer } from '../../../redux/fio/actions';

import { isProcessing } from '../../../redux/registrations/selectors';
import { loading } from '../../../redux/fio/selectors';

import { FioNameTransferContainer } from './FioNameTransferContainer';
import { emptyWallet } from '../../../redux/fio/reducer';
import { FioWalletDoublet, FioNameItemProps } from '../../../types';
import { ContainerOwnProps } from './types';
import { validate } from './validation';

const formConnect = reduxForm({
  form: 'transfer',
  getFormState: state => state.reduxForm,
  asyncValidate: validate,
  asyncChangeFields: [],
});

const feePrice = () => ({ costFio: 45.0, costUsdc: 1.0 }); //todo: get real fee data

const reduxConnect = connect(
  createStructuredSelector({
    feePrice,
    isProcessing,
    loading,
    walletPublicKey: (state: any, ownProps: ContainerOwnProps & any) => {
      // todo: set types for state
      const { fioNameList, name } = ownProps;
      const selected =
        fioNameList &&
        fioNameList.find(
          ({ name: itemName }: FioNameItemProps) => itemName === name,
        );
      return (selected && selected.walletPublicKey) || '';
    },
    currentWallet: (state: any, ownProps: ContainerOwnProps & any) => {
      // todo: fix ownProps type
      const { fioWallets } = state.fio;
      const { fioNameList, name } = ownProps;
      const selected =
        fioNameList &&
        fioNameList.find(
          ({ name: itemName }: FioNameItemProps) => itemName === name,
        );
      const walletPublicKey = (selected && selected.walletPublicKey) || '';
      const currentWallet: FioWalletDoublet =
        fioWallets &&
        fioWallets.find(
          (wallet: FioWalletDoublet) => wallet.publicKey === walletPublicKey,
        );
      return currentWallet || emptyWallet;
    },
    transferAddressValue: (state: any) =>
      formValueSelector('transfer', (state: any) => state.reduxForm)(
        state,
        'transferAddress',
      ),
  }),
  {
    refreshBalance,
    transfer,
  },
);

export default compose(reduxConnect, formConnect)(FioNameTransferContainer);
