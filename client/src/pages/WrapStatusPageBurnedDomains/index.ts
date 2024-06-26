import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import WrapStatusPageBurnedDomains from './WrapStatusPageBurnedDomains';

import { compose } from '../../utils';

import {
  loading,
  burnedDomainsList,
  burnedDomainsListCount,
} from '../../redux/wrapStatus/selectors';
import { getBurnedDomainsList } from '../../redux/wrapStatus/actions';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    data: burnedDomainsList,
    maxDataItemsCount: burnedDomainsListCount,
  }),
  {
    getData: getBurnedDomainsList,
  },
);

export default compose(reduxConnect)(WrapStatusPageBurnedDomains);
