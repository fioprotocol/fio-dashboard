import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import WrapStatusPage from './WrapStatusPage';
import {
  loading,
  unwrapDomainsList,
  unwrapDomainsListCount,
  unwrapTokensList,
  unwrapTokensListCount,
  wrapDomainsList,
  wrapDomainsListCount,
  wrapTokensList,
  wrapTokensListCount,
} from '../../redux/wrapStatus/selectors';
import {
  getUnwrapDomainsList,
  getUnwrapTokensList,
  getWrapDomainsList,
  getWrapTokensList,
} from '../../redux/wrapStatus/actions';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    wrapTokensList,
    wrapTokensListCount,
    wrapDomainsList,
    wrapDomainsListCount,
    unwrapTokensList,
    unwrapTokensListCount,
    unwrapDomainsList,
    unwrapDomainsListCount,
  }),
  {
    getWrapTokensList,
    getWrapDomainsList,
    getUnwrapDomainsList,
    getUnwrapTokensList,
  },
);

export default compose(reduxConnect)(WrapStatusPage);
