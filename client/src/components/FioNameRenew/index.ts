import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import apis from '../../api';
import { compose, hasFioAddressDelimiter } from '../../utils';

import { refreshBalance, getFee } from '../../redux/fio/actions';

import { loading, currentWallet } from '../../redux/fio/selectors';
import { roe } from '../../redux/registrations/selectors';

import FioNameRenewContainer from './FioNameRenewContainer';
import { ContainerOwnProps } from './types';
import { ReduxState } from '../../redux/init';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    fee: (state: ReduxState, ownProps: ContainerOwnProps & any) => {
      const { fees } = state.fio;
      return fees[
        hasFioAddressDelimiter(ownProps.name)
          ? apis.fio.actionEndPoints.renewFioAddress
          : apis.fio.actionEndPoints.renewFioDomain
      ];
    },
    roe,
    currentWallet,
  }),
  {
    refreshBalance,
    getFee: (isFioAddress: boolean) =>
      getFee(
        isFioAddress
          ? apis.fio.actionEndPoints.renewFioAddress
          : apis.fio.actionEndPoints.renewFioDomain,
      ),
  },
);

export default compose(reduxConnect)(FioNameRenewContainer);
