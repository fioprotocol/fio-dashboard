import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { EndPoint } from '@fioprotocol/fiosdk';

import { compose } from '../../../../utils';

import {
  getFee,
  getOracleFees,
  refreshBalance,
  resetFioNames,
} from '../../../../redux/fio/actions';

import {
  currentWallet,
  fioDomains,
  loading,
} from '../../../../redux/fio/selectors';
import { roe } from '../../../../redux/registrations/selectors';

import { AdditionalAction } from '../../../../constants/fio';

import WrapDomainContainer from './WrapDomainContainer';
import { refreshWalletDataPublicKey } from '../../../../redux/fioWalletsData/actions';
import { ReduxState } from '../../../../redux/init';
import {
  DEFAULT_FEE_PRICES,
  getDefaultOracleFeePrices,
} from '../../../../util/prices';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    roe,
    currentWallet,
    fioDomains,
    feePrice: (state: ReduxState) =>
      state.fio.fees[EndPoint.wrapFioDomain] || DEFAULT_FEE_PRICES,
    oracleFeePrice: (state: ReduxState) =>
      state.fio.oracleFees[EndPoint.wrapFioDomain] ||
      getDefaultOracleFeePrices({
        roe: state.fio.roe,
        action: AdditionalAction.wrapFioDomain,
      }),
  }),
  {
    refreshBalance,
    getFee: () => getFee(EndPoint.wrapFioDomain),
    getOracleFees: () => getOracleFees(),
    refreshWalletDataPublicKey,
    resetFioNames,
  },
);

export default compose(reduxConnect)(WrapDomainContainer);
