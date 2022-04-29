import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { getFee, getOracleFees, refreshBalance } from '../../redux/fio/actions';
import { refreshWalletDataPublicKey } from '../../redux/fioWalletsData/actions';

import { loading } from '../../redux/fio/selectors';
import { roe } from '../../redux/registrations/selectors';

import WrapPage from './WrapPage';

import { emptyWallet } from '../../redux/fio/reducer';
import {
  DEFAULT_FEE_PRICES,
  DEFAULT_ORACLE_FEE_PRICES,
} from '../../util/prices';

import apis from '../../api';

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
          publicKey === ownProps.match.params.publicKey,
      );
    },
    loading,
    roe,
    feePrice: (state: ReduxState) =>
      state.fio.fees[apis.fio.actionEndPoints.wrapFioTokens] ||
      DEFAULT_FEE_PRICES,
    oracleFeePrice: (state: ReduxState) =>
      state.fio.oracleFees[apis.fio.actionEndPoints.wrapFioTokens] ||
      DEFAULT_ORACLE_FEE_PRICES,
  }),
  {
    refreshBalance,
    getFee: () => getFee(apis.fio.actionEndPoints.wrapFioTokens),
    getOracleFees: () => getOracleFees(),
    refreshWalletDataPublicKey,
  },
);

export default compose(reduxConnect)(WrapPage);
