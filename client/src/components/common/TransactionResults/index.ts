import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../../utils';

import { setStep } from '../../../redux/containedFlow/actions';

import { onTxResultsClose } from '../../../redux/fio/actions';

import Results from './Results';

const reduxConnect = connect(createStructuredSelector({}), {
  setStep,
  onTxResultsClose,
});

export default compose(reduxConnect)(Results);
