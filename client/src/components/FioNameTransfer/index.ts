import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { EndPoint } from '@fioprotocol/fiosdk';

import { refreshBalance, getFee } from '../../redux/fio/actions';

import { loading, currentWallet } from '../../redux/fio/selectors';
import { roe } from '../../redux/registrations/selectors';

import { FioNameTransferContainer } from './FioNameTransferContainer';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    roe,
    currentWallet,
  }),
  {
    refreshBalance,
    getFee: (isFioAddress: boolean) =>
      getFee(
        isFioAddress ? EndPoint.transferFioAddress : EndPoint.transferFioDomain,
      ),
  },
);

export default reduxConnect(FioNameTransferContainer);
