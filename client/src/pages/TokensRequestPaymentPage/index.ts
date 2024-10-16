import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { EndPoint } from '@fioprotocol/fiosdk';

import { compose } from '../../utils';

import { createContact, getContactsList } from '../../redux/contacts/actions';
import { refreshWalletDataPublicKey } from '../../redux/fioWalletsData/actions';
import { getFee } from '../../redux/fio/actions';

import {
  list as contactsList,
  loading as contactsLoading,
} from '../../redux/contacts/selectors';

import PaymentDetailsPage from './PaymentDetailsPage';

import { DEFAULT_FEE_PRICES } from '../../util/prices';

import { ReduxState } from '../../redux/init';

const reduxConnect = connect(
  createStructuredSelector({
    contactsList,
    loading: contactsLoading,
    feePrice: (state: ReduxState) =>
      state.fio.fees[EndPoint.recordObtData] || DEFAULT_FEE_PRICES,
  }),
  {
    createContact,
    getContactsList,
    refreshWalletDataPublicKey,
    getFee: (fioAddress: string) => getFee(EndPoint.recordObtData, fioAddress),
  },
);

export default compose(reduxConnect)(PaymentDetailsPage);
