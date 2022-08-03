import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';
import SignNft from './SignNft';

import { fioAddresses, fioWallets, loading } from '../../redux/fio/selectors';
import {
  getFee,
  refreshFioNames,
  getNFTSignatures,
} from '../../redux/fio/actions';

import apis from '../../api';

import { DEFAULT_FEE_PRICES } from '../../util/prices';
import { ACTIONS } from '../../constants/fio';

import { ReduxState } from '../../redux/init';

const reduxConnect = connect(
  createStructuredSelector({
    fioAddresses,
    fioWallets,
    feePrice: (state: ReduxState) => {
      const { fees } = state.fio;

      return (
        fees[apis.fio.actionEndPoints[ACTIONS.addNft]] || DEFAULT_FEE_PRICES
      );
    },
    loading,
  }),
  {
    getFee: (fioAddress: string) =>
      getFee(apis.fio.actionEndPoints[ACTIONS.addNft], fioAddress),
    refreshFioNames,
    getNFTSignatures,
  },
);

export default compose(reduxConnect)(SignNft);
