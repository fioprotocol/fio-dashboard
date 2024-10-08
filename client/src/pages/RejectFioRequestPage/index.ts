import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { EndPoint } from '@fioprotocol/fiosdk';

import { compose } from '../../utils';

import { refreshWalletDataPublicKey } from '../../redux/fioWalletsData/actions';
import { getFee } from '../../redux/fio/actions';

import RejectFioRequestPage from './RejectFioRequestPage';

import { DEFAULT_FEE_PRICES } from '../../util/prices';

import { ReduxState } from '../../redux/init';

const reduxConnect = connect(
  createStructuredSelector({
    feePrice: (state: ReduxState) =>
      state.fio.fees[EndPoint.rejectFundsRequest] || DEFAULT_FEE_PRICES,
  }),
  {
    refreshWalletDataPublicKey,
    getFee: (fioAddress: string) =>
      getFee(EndPoint.rejectFundsRequest, fioAddress),
  },
);

export default compose(reduxConnect)(RejectFioRequestPage);
