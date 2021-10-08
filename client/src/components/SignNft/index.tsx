import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';
import SignNft from './SignNft';

import {
  fioAddresses,
  fioWallets,
  signNftProcessing,
} from '../../redux/fio/selectors';
import { confirmingPin, pinConfirmation } from '../../redux/edge/selectors';
import {
  singNFT,
  getFee,
  FIO_SIGN_NFT_REQUEST,
  refreshFioNames,
  getSignaturesFromFioAddress,
} from '../../redux/fio/actions';
import { showPinModal } from '../../redux/modal/actions';
import { resetPinConfirm } from '../../redux/edge/actions';

import apis from '../../api';
import { ReduxState } from '../../redux/init';

const reduxConnect = connect(
  createStructuredSelector({
    fioAddresses,
    fioWallets,
    confirmingPin,
    pinConfirmation,
    signNftProcessing,
    fee: (state: ReduxState) => {
      const { fees } = state.fio;

      return fees[apis.fio.actionEndPoints.signNft];
    },
    result: (state: ReduxState) => {
      const { transactionResult } = state.fio;
      const result = transactionResult[FIO_SIGN_NFT_REQUEST];
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
  }),
  {
    showPinModal,
    resetPinConfirm,
    getFee: (fioAddress: string) =>
      getFee(apis.fio.actionEndPoints.signNft, fioAddress),
    singNFT,
    refreshFioNames,
    getSignaturesFromFioAddress,
  },
);

export default compose(reduxConnect)(SignNft);
