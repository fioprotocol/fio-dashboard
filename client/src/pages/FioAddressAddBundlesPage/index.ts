import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { getFee } from '../../redux/fio/actions';
import { fioAddresses, loading } from '../../redux/fio/selectors';
import { roe } from '../../redux/registrations/selectors';

import FioAddressAddBundlesPage from './FioAddressAddBundlesPage';

import apis from '../../api';

import { compose } from '../../utils';

import { DEFAULT_FEE_PRICES } from '../../util/prices';

import { ReduxState } from '../../redux/init';

const reduxConnect = connect(
  createStructuredSelector({
    fioAddresses,
    loading,
    feePrice: (state: ReduxState) => {
      const { fees } = state.fio;
      return (
        fees[apis.fio.actionEndPoints.addBundledTransactions] ||
        DEFAULT_FEE_PRICES
      );
    },
    roe,
  }),
  {
    getFee: () => getFee(apis.fio.actionEndPoints.addBundledTransactions),
  },
);

export default withRouter(compose(reduxConnect)(FioAddressAddBundlesPage));
