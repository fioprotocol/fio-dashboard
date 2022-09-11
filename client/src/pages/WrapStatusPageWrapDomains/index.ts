import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import WrapStatusPageWrapDomains from './WrapStatusPageWrapDomains';

import { compose } from '../../utils';

import {
  loading,
  wrapDomainsList,
  wrapDomainsListCount,
} from '../../redux/wrapStatus/selectors';
import { getWrapDomainsList } from '../../redux/wrapStatus/actions';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    data: wrapDomainsList,
    maxDataItemsCount: wrapDomainsListCount,
  }),
  {
    getData: getWrapDomainsList,
  },
);

export default compose(reduxConnect)(WrapStatusPageWrapDomains);
