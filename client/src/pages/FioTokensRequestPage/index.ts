import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { EndPoint } from '@fioprotocol/fiosdk';

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

import { ReduxState } from '../../redux/init';

const reduxConnect = connect(
  createStructuredSelector({
    fioWalletsLoading,
    fioWallets,
    roe,
    contactsList,
    contactsLoading,
    feePrice: (state: ReduxState) =>
      state.fio.fees[EndPoint.newFundsRequest] || DEFAULT_FEE_PRICES,
  }),
  {
    createContact,
    getContactsList,
    refreshWalletDataPublicKey,
    getFee: (fioAddress: string) =>
      getFee(EndPoint.newFundsRequest, fioAddress),
  },
);

export default compose(reduxConnect)(FioTokensRequestPage);
