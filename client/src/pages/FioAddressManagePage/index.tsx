import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import FioAddressManagePage from './FioAddressManagePage';

const data = [
  {
    fio_address: 'fio15965508586351@fiotestnet',
    expiration: '2021-07-05T11:10:10',
    remaining_bundled_tx: 65,
  },
  {
    fio_address: 'testblabla@fiotestnet',
    expiration: '2021-10-14T11:17:53',
    remaining_bundled_tx: 0,
  },
  {
    fio_address: 'fio15965508586353@fiotestnet',
    expiration: '2021-10-14T13:12:09',
    remaining_bundled_tx: 0,
  },
];

const reduxConnect = connect(
  createStructuredSelector({
    data: () => data,
  }),
  {},
);

export default compose(reduxConnect)(FioAddressManagePage);
