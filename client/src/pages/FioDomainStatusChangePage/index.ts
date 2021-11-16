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
} from '../../redux/fio/selectors';

import FioDomainStatusChangePage from './FioDomainStatusChangePage';

import { DEFAULT_FEE_PRICES } from '../../util/prices';

import { ReduxState } from '../../redux/init';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    confirmingPin,
    roe,
    feePrice: (state: ReduxState) =>
      state.fio.fees[apis.fio.actionEndPoints.setFioDomainPublic] ||
      DEFAULT_FEE_PRICES,
    selectedFioDomain,
    fioWallet: fioWalletForDomain,
  }),
  {
    refreshBalance,
    getFee: () => getFee(apis.fio.actionEndPoints.setFioDomainPublic),
  },
);

export default compose(reduxConnect)(FioDomainStatusChangePage);
