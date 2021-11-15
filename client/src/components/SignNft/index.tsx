import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';
import SignNft from './SignNft';

import { fioAddresses, fioWallets } from '../../redux/fio/selectors';
import {
  getFee,
  refreshFioNames,
  getNFTSignatures,
} from '../../redux/fio/actions';

import apis from '../../api';
import { ReduxState } from '../../redux/init';

const reduxConnect = connect(
  createStructuredSelector({
    fioAddresses,
    fioWallets,
    fee: (state: ReduxState) => {
      const { fees } = state.fio;

      return fees[apis.fio.actionEndPoints.signNft];
    },
  }),
  {
    getFee: (fioAddress: string) =>
      getFee(apis.fio.actionEndPoints.signNft, fioAddress),
    refreshFioNames,
    getNFTSignatures,
  },
);

export default compose(reduxConnect)(SignNft);
