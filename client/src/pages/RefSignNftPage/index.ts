import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { getFioAddresses } from '../../redux/fio/actions';

import { loading as edgeAuthLoading } from '../../redux/edge/selectors';
import { isAuthenticated } from '../../redux/profile/selectors';
import { fioAddresses, fioWallets } from '../../redux/fio/selectors';
import {
  loading,
  refProfileInfo,
  refProfileQueryParams,
  homePageLink,
} from '../../redux/refProfile/selectors';

import { RefSignNftPage } from './RefSignNftPage';

const reduxConnect = connect(
  createStructuredSelector({
    isAuthenticated,
    loading,
    edgeAuthLoading,
    refProfileInfo,
    refProfileQueryParams,
    fioAddresses,
    fioWallets,
    homePageLink,
  }),
  {
    getFioAddresses,
  },
);

export default compose(reduxConnect)(RefSignNftPage);
