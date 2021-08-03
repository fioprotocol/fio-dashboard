import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import apis from '../../../api';
import { compose, hasFioAddressDelimiter } from '../../../utils';

import { refreshBalance, transfer, getFee } from '../../../redux/fio/actions';
import { getPrices } from '../../../redux/registrations/actions';
import { resetPinConfirm } from '../../../redux/edge/actions';
import { showPinModal } from '../../../redux/modal/actions';

import { pinConfirmation, confirmingPin } from '../../../redux/edge/selectors';
import { loading, transferProcessing } from '../../../redux/fio/selectors';

import FioNameRenewContainer from './FioNameRenewContainer';
import { emptyWallet } from '../../../redux/fio/reducer';
import { FioWalletDoublet } from '../../../types';
import { ContainerOwnProps, FeePrice } from './types';
import { getElementByFioName } from '../../../utils';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    transferProcessing,
    confirmingPin,
    pinConfirmation,
    result: () => {
      // todo: set results
      return {};
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
      const { walletPublicKey } = getElementByFioName({ fioNameList, name });
      return walletPublicKey || '';
    },
    currentWallet: (state: any, ownProps: ContainerOwnProps & any) => {
      // todo: fix ownProps type
      const { fioWallets } = state.fio;
      const { fioNameList, name } = ownProps;
      const { walletPublicKey } = getElementByFioName({ fioNameList, name });

      const currentWallet: FioWalletDoublet =
        fioWallets &&
        fioWallets.find(
          (wallet: FioWalletDoublet) => wallet.publicKey === walletPublicKey,
        );
      return currentWallet || emptyWallet;
    },
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

export default compose(reduxConnect)(FioNameRenewContainer);
