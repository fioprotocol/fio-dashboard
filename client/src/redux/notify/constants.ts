import { GET_USERS_RECOVERY_QUESTIONS_FAILURE } from '../edge/actions';

export const ErrorText = {
  [GET_USERS_RECOVERY_QUESTIONS_FAILURE]: {
    title: "Can't Get Recovery Questions",
    message: 'Link is broken or outdated.',
    buttonText: 'CLOSE',
  },
};
