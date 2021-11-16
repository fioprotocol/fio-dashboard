import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import apis from '../../api';
import { hasFioAddressDelimiter } from '../../utils';

import { refreshBalance, getFee } from '../../redux/fio/actions';

import { loading, currentWallet } from '../../redux/fio/selectors';
import { roe } from '../../redux/registrations/selectors';

import { FioNameTransferContainer } from './FioNameTransferContainer';

import { DEFAULT_FEE_PRICES } from '../../util/prices';

import { ContainerOwnProps } from './types';
import { ReduxState } from '../../redux/init';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    roe,
    feePrice: (state: ReduxState, ownProps: ContainerOwnProps & any) => {
      const { fees } = state.fio;
      return (
        fees[
          hasFioAddressDelimiter(ownProps.name)
            ? apis.fio.actionEndPoints.transferFioAddress
            : apis.fio.actionEndPoints.transferFioDomain
        ] || DEFAULT_FEE_PRICES
      );
    },
    currentWallet,
  }),
  {
    refreshBalance,
    getFee: (isFioAddress: boolean) =>
      getFee(
        isFioAddress
          ? apis.fio.actionEndPoints.transferFioAddress
          : apis.fio.actionEndPoints.transferFioDomain,
      ),
  },
);

export default reduxConnect(FioNameTransferContainer);
