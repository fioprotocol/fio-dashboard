import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';
import { linkTokens } from '../../redux/fio/actions';
import { currentFioAddress } from '../../redux/fio/selectors';

import DeleteTokenPage from './DeleteTokenPage';

const reduxConnect = connect(
  createStructuredSelector({
    currentFioAddress,
  }),
  {
    onSubmit: linkTokens,
  },
);

export default compose(reduxConnect)(DeleteTokenPage);
