import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import FioDomainManagePage from './FioDomainManagePage';

const data = [
  {
    fio_domain: 'alice',
    expiration: '2020-09-11T18:30:56',
    is_public: 0,
  },
  {
    fio_domain: 'alicelalala',
    expiration: '2021-12-11T18:30:56',
    is_public: 1,
  },
  {
    fio_domain: 'alicecooper',
    expiration: '2021-09-11T18:30:56',
    is_public: 0,
  },
]; // todo: remove to real data

const reduxConnect = connect(
  createStructuredSelector({
    data: () => data,
  }),
  {},
);

export default compose(reduxConnect)(FioDomainManagePage);
