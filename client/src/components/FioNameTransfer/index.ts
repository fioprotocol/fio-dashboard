import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import apis from '../../api';
import { hasFioAddressDelimiter } from '../../utils';
import { setFees } from '../../util/prices';

import { refreshBalance, transfer, getFee } from '../../redux/fio/actions';
import { resetPinConfirm } from '../../redux/edge/actions';
import { showPinModal } from '../../redux/modal/actions';

import { pinConfirmation, confirmingPin } from '../../redux/edge/selectors';
import {
  loading,
  transferProcessing,
  currentWallet,
  walletPublicKey,
} from '../../redux/fio/selectors';

import { FioNameTransferContainer } from './FioNameTransferContainer';
import { ContainerOwnProps } from './types';
import { ReduxState } from '../../redux/init';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    transferProcessing,
    confirmingPin,
    pinConfirmation,
    result: (state: ReduxState) => {
      const { transactionResult: result } = state.fio;
      if (result && result.fee_collected) {
        const { roe } = state.registrations;
        const feeCollected = result.fee_collected;
        return {
          feeCollected: {
            nativeAmount: feeCollected,
            costFio: apis.fio.sufToAmount(feeCollected),
            costUsdc: apis.fio.convert(feeCollected, roe),
          },
          newOwnerKey: result.newOwnerKey,
        };
      }

      return result;
    },
    feePrice: (state: ReduxState, ownProps: ContainerOwnProps & any) => {
      const { fees } = state.fio;
      const { prices, roe } = state.registrations;
      const feeEndPoint = hasFioAddressDelimiter(ownProps.name)
        ? apis.fio.actionEndPoints.transferFioAddress
        : apis.fio.actionEndPoints.transferFioDomain;
      return setFees(fees[feeEndPoint], prices, roe);
    },
    walletPublicKey,
    currentWallet,
  }),
  {
    refreshBalance,
    transfer,
    showPinModal,
    resetPinConfirm,
    getFee: (isFioAddress: boolean) =>
      getFee(
        isFioAddress
          ? apis.fio.actionEndPoints.transferFioAddress
          : apis.fio.actionEndPoints.transferFioDomain,
      ),
  },
);

export default reduxConnect(FioNameTransferContainer);
