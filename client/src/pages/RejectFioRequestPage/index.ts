import { connect } from 'react-redux';

import { compose } from '../../utils';

import { refreshWalletDataPublicKey } from '../../redux/fioWalletsData/actions';

import RejectFioRequestPage from './RejectFioRequestPage';

const reduxConnect = connect(null, {
  refreshWalletDataPublicKey,
});

export default compose(reduxConnect)(RejectFioRequestPage);
