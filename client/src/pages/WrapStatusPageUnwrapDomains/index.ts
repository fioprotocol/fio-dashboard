import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import WrapStatusPageUnwrapDomains from './WrapStatusPageUnwrapDomains';

import { compose } from '../../utils';
import {
  loading,
  unwrapDomainsList,
  unwrapDomainsListCount,
} from '../../redux/wrapStatus/selectors';
import { getUnwrapDomainsList } from '../../redux/wrapStatus/actions';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    data: unwrapDomainsList,
    maxDataItemsCount: unwrapDomainsListCount,
  }),
  {
    getData: getUnwrapDomainsList,
  },
);

export default compose(reduxConnect)(WrapStatusPageUnwrapDomains);
