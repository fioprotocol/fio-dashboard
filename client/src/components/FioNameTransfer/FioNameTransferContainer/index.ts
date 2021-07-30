import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { createStructuredSelector } from 'reselect';

import apis from '../../../api';
import { compose, hasFioAddressDelimiter } from '../../../utils';

import {
  refreshBalance,
  transfer,
  getFee,
  TRANSFER_REQUEST,
} from '../../../redux/fio/actions';
import { getPrices } from '../../../redux/registrations/actions';
import { resetPinConfirm } from '../../../redux/edge/actions';
import { showPinModal } from '../../../redux/modal/actions';

import { pinConfirmation, confirmingPin } from '../../../redux/edge/selectors';
import { loading, transferProcessing } from '../../../redux/fio/selectors';

import { FioNameTransferContainer } from './FioNameTransferContainer';
import { emptyWallet } from '../../../redux/fio/reducer';
import { FioWalletDoublet, FioNameItemProps } from '../../../types';
import { ContainerOwnProps, FeePrice } from './types';
import { validate } from './validation';

const formConnect = reduxForm({
  form: 'transfer',
  getFormState: state => state.reduxForm,
  asyncValidate: validate,
  asyncChangeFields: [],
});

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    transferProcessing,
    confirmingPin,
    pinConfirmation,
    result: (state: any) => {
      const { transactionResult } = state.fio;
      const result = transactionResult[TRANSFER_REQUEST];
      if (result && result.fee_collected) {
        const { prices } = state.registrations;
        const feeCollected = result.fee_collected;
        return {
          feeCollected: {
            nativeAmount: feeCollected,
            costFio: apis.fio.sufToAmount(feeCollected),
            costUsdc: apis.fio.convert(feeCollected, prices.usdtRoe),
          },
          newOwnerKey: result.newOwnerKey,
        };
      }

      return result;
    },
    feePrice: (state: any, ownProps: ContainerOwnProps & any) => {
      const { fees } = state.fio;
      const { prices } = state.registrations;
      const feeEndPoint = hasFioAddressDelimiter(ownProps.name)
        ? apis.fio.actionEndPoints.transferFioAddress
        : apis.fio.actionEndPoints.transferFioDomain;
      const fee: FeePrice = {
        nativeFio: null,
        costFio: null,
        costUsdc: null,
      };
      fee.nativeFio = fees[feeEndPoint];
      fee.costFio = apis.fio.sufToAmount(fee.nativeFio);
      if (fee.nativeFio && prices.usdtRoe) {
        fee.costUsdc = apis.fio.convert(fee.nativeFio, prices.usdtRoe);
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
    showPinModal,
    resetPinConfirm,
    getPrices,
    getFee: (isFioAddress: boolean) =>
      getFee(
        isFioAddress
          ? apis.fio.actionEndPoints.transferFioAddress
          : apis.fio.actionEndPoints.transferFioDomain,
      ),
  },
);

export default compose(reduxConnect, formConnect)(FioNameTransferContainer);
