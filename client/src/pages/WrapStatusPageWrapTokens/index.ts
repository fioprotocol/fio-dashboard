import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import WrapStatusPageWrapTokens from './WrapStatusPageWrapTokens';

import { compose } from '../../utils';

import {
  loading,
  wrapTokensList,
  wrapTokensListCount,
} from '../../redux/wrapStatus/selectors';
import { getWrapTokensList } from '../../redux/wrapStatus/actions';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    data: wrapTokensList,
    maxDataItemsCount: wrapTokensListCount,
  }),
  {
    getData: getWrapTokensList,
  },
);

export default compose(reduxConnect)(WrapStatusPageWrapTokens);
