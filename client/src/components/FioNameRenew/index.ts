import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import apis from '../../api';
import { compose, setFees, hasFioAddressDelimiter } from '../../utils';

import {
  refreshBalance,
  renew,
  getFee,
  RENEW_REQUEST,
} from '../../redux/fio/actions';
import { getPrices } from '../../redux/registrations/actions';
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
        const { prices } = state.registrations;
        const feeCollected = result.fee_collected;
        return {
          feeCollected: {
            nativeAmount: feeCollected,
            costFio: apis.fio.sufToAmount(feeCollected),
            costUsdc: apis.fio.convert(feeCollected, prices.usdtRoe),
          },
        };
      }

      return result;
    },
    feePrice: (state: any, ownProps: ContainerOwnProps & any) => {
      const { fees } = state.fio;
      const { prices } = state.registrations;

      const feeEndPoint = hasFioAddressDelimiter(ownProps.name)
        ? apis.fio.actionEndPoints.renewFioAddress
        : apis.fio.actionEndPoints.renewFioDomain;
      return setFees(fees[feeEndPoint], prices);
    },
    walletPublicKey,
    currentWallet,
  }),
  {
    refreshBalance,
    renew,
    showPinModal,
    resetPinConfirm,
    getPrices,
    getFee: (isFioAddress: boolean) =>
      getFee(
        isFioAddress
          ? apis.fio.actionEndPoints.renewFioAddress
          : apis.fio.actionEndPoints.renewFioDomain,
      ),
  },
);

export default compose(reduxConnect)(FioNameRenewContainer);
