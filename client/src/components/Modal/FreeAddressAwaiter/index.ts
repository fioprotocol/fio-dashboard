import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../../utils';
import { toggleFreeAddressAwaiter } from '../../../redux/modal/actions';
import { showFreeAddressAwaiter } from '../../../redux/modal/selectors';
import { user, isAuthenticated } from '../../../redux/profile/selectors';
import { isRefFlow } from '../../../redux/refProfile/selectors';
import { fioAddresses } from '../../../redux/fio/selectors';
import { loading } from '../../../redux/profile/selectors';

import FreeAddressAwaiter from './FreeAddressAwaiter';

const reduxConnect = connect(
  createStructuredSelector({
    showFreeAddressAwaiter,
    user,
    fioAddresses,
    isAuthenticated,
    isRefFlow,
    loading,
  }),
  {
    toggleFreeAddressAwaiter,
  },
);

export default compose(reduxConnect)(FreeAddressAwaiter);
