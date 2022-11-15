import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { emptyWallet } from '../../redux/fio/reducer';

import FioTokensReceivePage from './FioTokensReceivePage';

import { ContainerProps, LocationProps } from './types';
import { FioAddressDoublet, FioWalletDoublet, OwnPropsAny } from '../../types';
import { ReduxState } from '../../redux/init';

const reduxConnect = connect(
  createStructuredSelector({
    fioWallet: (
      state: ReduxState,
      ownProps: ContainerProps & LocationProps & OwnPropsAny,
    ) => {
      const { fioWallets } = state.fio;

      return (
        fioWallets.find(
          ({ publicKey: walletPublicKey }: FioWalletDoublet) =>
            walletPublicKey === ownProps.location?.query?.publicKey,
        ) || emptyWallet
      );
    },
    fioCryptoHandles: (
      state: ReduxState,
      ownProps: ContainerProps & LocationProps & OwnPropsAny,
    ) => {
      const { fioAddresses } = state.fio;

      return fioAddresses.filter(
        ({ walletPublicKey }: FioAddressDoublet) =>
          walletPublicKey === ownProps.location?.query?.publicKey,
      );
    },
  }),
  {},
);

export default compose(reduxConnect)(FioTokensReceivePage);
