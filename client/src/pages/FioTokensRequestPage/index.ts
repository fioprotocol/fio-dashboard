import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { refreshWalletDataPublicKey } from '../../redux/fioWalletsData/actions';
import { createContact, getContactsList } from '../../redux/contacts/actions';
import { getFee } from '../../redux/fio/actions';

import {
  loading as fioWalletsLoading,
  fioWallets,
} from '../../redux/fio/selectors';
import {
  loading as contactsLoading,
  list as contactsList,
} from '../../redux/contacts/selectors';
import { roe } from '../../redux/registrations/selectors';

import FioTokensRequestPage from './FioTokensRequestPage';

import { DEFAULT_FEE_PRICES } from '../../util/prices';

import apis from '../../api';

import { ReduxState } from '../../redux/init';

const reduxConnect = connect(
  createStructuredSelector({
    fioWalletsLoading,
    fioWallets,
    roe,
    contactsList,
    contactsLoading,
    feePrice: (state: ReduxState) =>
      state.fio.fees[apis.fio.actionEndPoints.newFundsRequest] ||
      DEFAULT_FEE_PRICES,
  }),
  {
    createContact,
    getContactsList,
    refreshWalletDataPublicKey,
    getFee: (fioAddress: string) =>
      getFee(apis.fio.actionEndPoints.newFundsRequest, fioAddress),
  },
);

export default compose(reduxConnect)(FioTokensRequestPage);
