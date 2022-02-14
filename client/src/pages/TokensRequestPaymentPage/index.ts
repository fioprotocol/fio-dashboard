import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { createContact, getContactsList } from '../../redux/contacts/actions';

import {
  list as contactsList,
  loading as contactsLoading,
} from '../../redux/contacts/selectors';

import PaymentDetailsPage from './PaymentDetailsPage';
import { refreshWalletDataPublicKey } from '../../redux/fio/actions';

const reduxConnect = connect(
  createStructuredSelector({
    contactsList,
    loading: contactsLoading,
  }),
  {
    createContact,
    getContactsList,
    refreshWalletDataPublicKey,
  },
);

export default compose(reduxConnect)(PaymentDetailsPage);
