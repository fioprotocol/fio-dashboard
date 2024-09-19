import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { EndPoint } from '@fioprotocol/fiosdk';

import { compose } from '../../utils';

import { getFee, getOracleFees, refreshBalance } from '../../redux/fio/actions';
import { refreshWalletDataPublicKey } from '../../redux/fioWalletsData/actions';

import { loading } from '../../redux/fio/selectors';
import { roe } from '../../redux/registrations/selectors';

import WrapTokensPage from './WrapTokensPage';

import { emptyWallet } from '../../redux/fio/reducer';
import {
  DEFAULT_FEE_PRICES,
  getDefaultOracleFeePrices,
} from '../../util/prices';

import { AdditionalAction } from '../../constants/fio';

import { ReduxState } from '../../redux/init';
import { ContainerOwnProps } from './types';
import { FioWalletDoublet, OwnPropsAny } from '../../types';

const reduxConnect = connect(
  createStructuredSelector({
    fioWallet: (
      state: ReduxState,
      ownProps: ContainerOwnProps & OwnPropsAny,
    ) => {
      const { fioWallets } = state.fio;
      if (!('match' in ownProps)) return emptyWallet;

      return fioWallets.find(
        ({ publicKey }: FioWalletDoublet) =>
          publicKey === ownProps.location?.query?.publicKey,
      );
    },
    loading,
    roe,
    feePrice: (state: ReduxState) =>
      state.fio.fees[EndPoint.wrapFioTokens] || DEFAULT_FEE_PRICES,
    oracleFeePrice: (state: ReduxState) =>
      state.fio.oracleFees[EndPoint.wrapFioTokens] ||
      getDefaultOracleFeePrices({
        roe: state.fio.roe,
        action: AdditionalAction.wrapFioTokens,
      }),
  }),
  {
    refreshBalance,
    getFee: () => getFee(EndPoint.wrapFioTokens),
    getOracleFees: () => getOracleFees(),
    refreshWalletDataPublicKey,
  },
);

export default compose(reduxConnect)(WrapTokensPage);
