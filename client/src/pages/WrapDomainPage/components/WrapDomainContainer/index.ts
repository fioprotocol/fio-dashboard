import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import apis from '../../../../api';
import { compose } from '../../../../utils';

import {
  getFee,
  getOracleFees,
  refreshBalance,
} from '../../../../redux/fio/actions';

import {
  currentWallet,
  fioDomains,
  loading,
} from '../../../../redux/fio/selectors';
import { roe } from '../../../../redux/registrations/selectors';

import WrapDomainContainer from './WrapDomainContainer';
import { refreshWalletDataPublicKey } from '../../../../redux/fioWalletsData/actions';
import { ReduxState } from '../../../../redux/init';
import {
  DEFAULT_FEE_PRICES,
  DEFAULT_ORACLE_FEE_PRICES,
} from '../../../../util/prices';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    roe,
    currentWallet,
    fioDomains,
    feePrice: (state: ReduxState) =>
      state.fio.fees[apis.fio.actionEndPoints.wrapFioDomain] ||
      DEFAULT_FEE_PRICES,
    oracleFeePrice: (state: ReduxState) =>
      state.fio.oracleFees[apis.fio.actionEndPoints.wrapFioDomain] ||
      DEFAULT_ORACLE_FEE_PRICES,
  }),
  {
    refreshBalance,
    getFee: () => getFee(apis.fio.actionEndPoints.wrapFioDomain),
    getOracleFees: () => getOracleFees(),
    refreshWalletDataPublicKey,
  },
);

export default compose(reduxConnect)(WrapDomainContainer);
