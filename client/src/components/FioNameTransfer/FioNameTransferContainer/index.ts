import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { createStructuredSelector } from 'reselect';

import apis from '../../../api';
import { compose } from '../../../utils';

import { refreshBalance, transfer, getFee } from '../../../redux/fio/actions';
import { getPrices } from '../../../redux/registrations/actions';

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

const reduxConnect = connect(
  createStructuredSelector({
    isProcessing,
    loading,
    feePrice: (state: any) => {
      const { fees } = state.fio;
      const { prices } = state.registrations;
      const fee: { costFio: number | null; costUsdc: number | null } = {
        costFio: null,
        costUsdc: null,
      };
      fee.costFio = apis.fio.sufToAmount(
        fees[apis.fio.actionEndPoints.transferFioAddress],
      );
      if (fee.costFio && prices.usdtRoe) {
        fee.costUsdc = apis.fio.convert(
          fees[apis.fio.actionEndPoints.transferFioAddress],
          prices.usdtRoe,
        );
      }

      return fee;
    },
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
    getPrices,
    getFee: (fioAddress: string) =>
      getFee(apis.fio.actionEndPoints.transferFioAddress, fioAddress),
  },
);

export default compose(reduxConnect, formConnect)(FioNameTransferContainer);
