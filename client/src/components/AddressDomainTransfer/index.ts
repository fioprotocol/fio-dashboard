import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { refreshBalance } from '../../redux/fio/actions';

import { isProcessing } from '../../redux/registrations/selectors';
import { loading } from '../../redux/fio/selectors';

import { AddressDomainTransferContainer } from './AddressDomainTransferContainer';
import { emptyWallet } from '../../redux/fio/reducer';
import { FioWalletDoublet, AddressDomainItemProps } from '../../types';
import { ContainerOwnProps } from './types';

const formConnect = reduxForm({
  form: 'transfer',
  getFormState: state => state.reduxForm,
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
          ({ name: itemName }: AddressDomainItemProps) => itemName === name,
        );
      return selected.walletPublicKey || '';
    },
    currentWallet: (state: any, ownProps: ContainerOwnProps & any) => {
      // todo: fix ownProps type
      const { fioWallets } = state.fio;
      const { fioNameList, name } = ownProps;
      const selected =
        fioNameList &&
        fioNameList.find(
          ({ name: itemName }: AddressDomainItemProps) => itemName === name,
        );
      const walletPublicKey = selected.walletPublicKey || '';
      const currentWallet: FioWalletDoublet =
        fioWallets &&
        fioWallets.find(
          (wallet: FioWalletDoublet) => wallet.publicKey === walletPublicKey,
        );
      return currentWallet || emptyWallet;
    },
  }),
  { refreshBalance },
);

export default compose(
  reduxConnect,
  formConnect,
)(AddressDomainTransferContainer);
