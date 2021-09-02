import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../../utils';
import { linkTokens } from '../../../redux/fio/actions';
import { currentFioAddress } from '../../../redux/fio/selectors';

import DeleteToken from './DeleteToken';

const reduxConnect = connect(
  createStructuredSelector({
    currentFioAddress,
  }),
  {
    onSubmit: linkTokens,
  },
);

export default compose(reduxConnect)(DeleteToken);
