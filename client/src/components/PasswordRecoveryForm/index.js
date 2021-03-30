import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';
import { passwordRecovery } from '../../redux/profile/actions';
import { loading } from '../../redux/edge/selectors';
import { showRecovery as show } from '../../redux/modal/selectors';
import { closeRecoveryModal as onClose } from '../../redux/modal/actions';

import PasswordRecoveryForm from './PasswordRecoveryForm';

//todo: Remove mocked data
const questions = () => [
  {
    type: 1,
    question:
      "What was your math's teacher's surname in your 3rd year of school?",
  },
  {
    type: 2,
    question: 'What was the name of your first stuffed toy?',
  },
  {
    type: 3,
    question: 'Where were you on New Year’s Eve in 2000?',
  },
  {
    type: 4,
    question: 'Where were you when you had your first kiss?',
  },
  {
    type: 5,
    question: 'What is the make and model of your dream car?',
  },
  {
    type: 6,
    question: 'Who is your childhood sport hero?',
  },
  {
    type: 7,
    question: 'Who was your childhood best friend?',
  },
  {
    type: 8,
    question: 'Who is your favorite superhero?',
  },
  {
    type: 9,
    question: 'What was the first country you ever traveled to?',
  },
  {
    type: 10,
    question: 'Who is your childhood sport hero?',
  },
];

const reduxConect = connect(
  createStructuredSelector({
    loading,
    show,
    questions,
  }),
  { onSubmit: passwordRecovery, onClose },
);

export { PasswordRecoveryForm };

export default compose(reduxConect)(PasswordRecoveryForm);
