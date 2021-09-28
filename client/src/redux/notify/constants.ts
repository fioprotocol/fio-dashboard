import { GET_USERS_RECOVERY_QUESTIONS_FAILURE } from '../edge/actions';
import { CONFIRM_EMAIL_FAILURE } from '../profile/actions';

export const ErrorText = {
  [GET_USERS_RECOVERY_QUESTIONS_FAILURE]: {
    title: "Can't Get Recovery Questions",
    message: 'Link is broken or outdated.',
    buttonText: 'CLOSE',
  },
  [CONFIRM_EMAIL_FAILURE]: {
    title: "Can't confirm your email",
    message: 'Link is broken or outdated.',
    buttonText: 'CLOSE',
  },
};
