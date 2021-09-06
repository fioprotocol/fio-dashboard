import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { reduxForm, formValueSelector } from 'redux-form';

import { compose } from '../../../utils';
import { currentFioAddress } from '../../../redux/fio/selectors';

import { validate } from './validation';

import { ReduxState } from '../../../redux/init';

import AddToken from './AddToken';

const formConnect = reduxForm({
  form: 'addToken',
  getFormState: state => state.reduxForm,
  validate,
});

const reduxConnect = connect(
  createStructuredSelector({
    currentFioAddress,
    addTokenValues: (state: ReduxState) =>
      formValueSelector('addToken', (state: ReduxState) => state.reduxForm)(
        state,
        'token',
      ),
  }),
  {},
);

export default compose(reduxConnect, formConnect)(AddToken);
