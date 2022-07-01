import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { refreshWalletDataPublicKey } from '../../redux/fioWalletsData/actions';

import { loading } from '../../redux/fio/selectors';
import { roe } from '../../redux/registrations/selectors';

import UnwrapTokensPage from './UnwrapTokensPage';

import { emptyWallet } from '../../redux/fio/reducer';

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
  }),
  {
    refreshWalletDataPublicKey,
  },
);

export default compose(reduxConnect)(UnwrapTokensPage);
