import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import apis from '../../api';
import { compose, hasFioAddressDelimiter } from '../../utils';
import { setFees } from '../../util/prices';

import {
  refreshBalance,
  renew,
  getFee,
  RENEW_REQUEST,
} from '../../redux/fio/actions';
import { resetPinConfirm } from '../../redux/edge/actions';
import { showPinModal } from '../../redux/modal/actions';

import { pinConfirmation, confirmingPin } from '../../redux/edge/selectors';
import {
  loading,
  renewProcessing,
  currentWallet,
  walletPublicKey,
} from '../../redux/fio/selectors';

import FioNameRenewContainer from './FioNameRenewContainer';
import { ContainerOwnProps } from './types';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    renewProcessing,
    confirmingPin,
    pinConfirmation,
    result: (state: any) => {
      const { transactionResult } = state.fio;
      const result = transactionResult[RENEW_REQUEST];
      if (result && result.fee_collected) {
        const { roe } = state.registrations;
        const feeCollected = result.fee_collected;
        return {
          feeCollected: {
            nativeAmount: feeCollected,
            costFio: apis.fio.sufToAmount(feeCollected),
            costUsdc: apis.fio.convert(feeCollected, roe),
          },
        };
      }

      return result;
    },
    feePrice: (state: any, ownProps: ContainerOwnProps & any) => {
      const { fees } = state.fio;
      const { prices, roe } = state.registrations;

      const feeEndPoint = hasFioAddressDelimiter(ownProps.name)
        ? apis.fio.actionEndPoints.renewFioAddress
        : apis.fio.actionEndPoints.renewFioDomain;
      return setFees(fees[feeEndPoint], prices, roe);
    },
    walletPublicKey,
    currentWallet,
  }),
  {
    refreshBalance,
    renew,
    showPinModal,
    resetPinConfirm,
    getFee: (isFioAddress: boolean) =>
      getFee(
        isFioAddress
          ? apis.fio.actionEndPoints.renewFioAddress
          : apis.fio.actionEndPoints.renewFioDomain,
      ),
  },
);

export default compose(reduxConnect)(FioNameRenewContainer);
