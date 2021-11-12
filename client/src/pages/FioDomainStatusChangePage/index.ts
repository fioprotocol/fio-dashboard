import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import apis from '../../api';
import { compose } from '../../utils';

import { refreshBalance, getFee } from '../../redux/fio/actions';

import { confirmingPin } from '../../redux/edge/selectors';
import { roe } from '../../redux/registrations/selectors';
import {
  loading,
  fioWalletForDomain,
  selectedFioDomain,
  fees,
} from '../../redux/fio/selectors';

import FioDomainStatusChangePage from './FioDomainStatusChangePage';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    confirmingPin,
    roe,
    fees,
    selectedFioDomain,
    fioWallet: fioWalletForDomain,
  }),
  {
    refreshBalance,
    getFee: () => getFee(apis.fio.actionEndPoints.setFioDomainPublic),
  },
);

export default compose(reduxConnect)(FioDomainStatusChangePage);
