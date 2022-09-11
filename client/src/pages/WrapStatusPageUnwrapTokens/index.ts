import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import {
  loading,
  unwrapTokensList,
  unwrapTokensListCount,
} from '../../redux/wrapStatus/selectors';
import { getUnwrapTokensList } from '../../redux/wrapStatus/actions';
import WrapStatusPageUnwrapTokens from './WrapStatusPageUnwrapTokens';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    data: unwrapTokensList,
    maxDataItemsCount: unwrapTokensListCount,
  }),
  {
    getData: getUnwrapTokensList,
  },
);

export default compose(reduxConnect)(WrapStatusPageUnwrapTokens);
