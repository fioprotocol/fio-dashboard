import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../../utils';

import { refreshBalance } from '../../../redux/fio/actions';

import { isProcessing } from '../../../redux/registrations/selectors';
import { loading } from '../../../redux/fio/selectors';

import { emptyWallet } from '../../../redux/fio/reducer';
import { FioWalletDoublet } from '../../../types';
import { ContainerOwnProps } from './types';

import { DOMAIN_STATUS } from '../../../constants/common';
import { getElementListByFioName } from '../../../utils';

import FioDomainStatusChangeContainer from './FioDomainStatusChangeContainer';

const feePrice = () => ({ costFio: 45.0, costUsdc: 1.0 }); //todo: get real fee data

const reduxConnect = connect(
  createStructuredSelector({
    feePrice,
    isProcessing,
    loading,
    domainStatus: (state: any, ownProps: ContainerOwnProps & any) => {
      // todo: set types for state & fix ownProps type
      const { fioNameList, name } = ownProps;
      const { isPublic } = getElementListByFioName({ fioNameList, name });

      return isPublic ? DOMAIN_STATUS.PUBLIC : DOMAIN_STATUS.PRIVATE;
    },
    walletPublicKey: (state: any, ownProps: ContainerOwnProps & any) => {
      // todo: set types for state & fix ownProps type
      const { fioNameList, name } = ownProps;
      const { walletPublicKey } = getElementListByFioName({
        fioNameList,
        name,
      });
      return walletPublicKey || '';
    },
    currentWallet: (state: any, ownProps: ContainerOwnProps & any) => {
      // todo: set types for state & fix ownProps type
      const { fioWallets } = state.fio;
      const { fioNameList, name } = ownProps;
      const { walletPublicKey } = getElementListByFioName({
        fioNameList,
        name,
      });

      const currentWallet: FioWalletDoublet =
        fioWallets &&
        fioWallets.find(
          (wallet: FioWalletDoublet) => wallet.publicKey === walletPublicKey,
        );
      return currentWallet || emptyWallet;
    },
  }),
  { refreshBalance },
);

export default compose(reduxConnect)(FioDomainStatusChangeContainer);
