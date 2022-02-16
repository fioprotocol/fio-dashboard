import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { refreshWalletDataPublicKey } from '../../redux/fioWalletsData/actions';
import { createContact, getContactsList } from '../../redux/contacts/actions';

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

const reduxConnect = connect(
  createStructuredSelector({
    fioWalletsLoading,
    fioWallets,
    roe,
    contactsList,
    contactsLoading,
  }),
  {
    createContact,
    getContactsList,
    refreshWalletDataPublicKey,
  },
);

export default compose(reduxConnect)(FioTokensRequestPage);
