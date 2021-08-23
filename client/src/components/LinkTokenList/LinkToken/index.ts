import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { reduxForm, formValueSelector } from 'redux-form';

import { compose } from '../../../utils';
import { currentFioAddress } from '../../../redux/fio/selectors';

import { validate } from './validation';

import LinkToken from './LinkToken';

const formConnect = reduxForm({
  form: 'linkToken',
  getFormState: state => state.reduxForm,
  validate,
});

const reduxConnect = connect(
  createStructuredSelector({
    currentFioAddress,
    linkTokenValues: (state: any) =>
      formValueSelector('linkToken', (state: any) => state.reduxForm)(
        state,
        'token',
      ),
  }),
  {},
);

export default compose(reduxConnect, formConnect)(LinkToken);
