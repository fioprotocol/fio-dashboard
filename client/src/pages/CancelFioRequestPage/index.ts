import { connect } from 'react-redux';

import { compose } from '../../utils';

import { refreshWalletDataPublicKey } from '../../redux/fioWalletsData/actions';

import CancelFioRequestPage from './CancelFioRequestPage';

const reduxConnect = connect(null, {
  refreshWalletDataPublicKey,
});

export default compose(reduxConnect)(CancelFioRequestPage);
