import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { refreshWalletDataPublicKey } from '../../redux/fioWalletsData/actions';
import { getFee } from '../../redux/fio/actions';

import CancelFioRequestPage from './CancelFioRequestPage';

import { DEFAULT_FEE_PRICES } from '../../util/prices';

import apis from '../../api';

import { ReduxState } from '../../redux/init';

const reduxConnect = connect(
  createStructuredSelector({
    feePrice: (state: ReduxState) =>
      state.fio.fees[apis.fio.actionEndPoints.cancelFundsRequest] ||
      DEFAULT_FEE_PRICES,
  }),
  {
    refreshWalletDataPublicKey,
    getFee: (fioAddress: string) =>
      getFee(apis.fio.actionEndPoints.cancelFundsRequest, fioAddress),
  },
);

export default compose(reduxConnect)(CancelFioRequestPage);
