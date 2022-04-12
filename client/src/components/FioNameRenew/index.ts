import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import apis from '../../api';
import { compose } from '../../utils';

import { refreshBalance, getFee } from '../../redux/fio/actions';

import { loading, currentWallet, fioDomains } from '../../redux/fio/selectors';
import { roe } from '../../redux/registrations/selectors';

import FioNameRenewContainer from './FioNameRenewContainer';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    roe,
    currentWallet,
    fioDomains,
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
