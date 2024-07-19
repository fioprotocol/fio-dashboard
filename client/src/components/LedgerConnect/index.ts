import { connect } from 'react-redux';

import { FC } from 'react';

import { compose } from '../../utils';

import { showGenericErrorModal } from '../../redux/modal/actions';

import LedgerConnect, { Props } from './LedgerConnect';

const reduxConnect = connect(null, { showGenericErrorModal });

export default compose(reduxConnect)(LedgerConnect) as FC<
  Omit<Props, 'showGenericErrorModal'>
>;
