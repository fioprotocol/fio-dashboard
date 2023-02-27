import { GET_USERS_RECOVERY_QUESTIONS_FAILURE } from '../edge/actions';
import { ROUTES } from '../../constants/routes';

export const ErrorData = {
  [GET_USERS_RECOVERY_QUESTIONS_FAILURE]: {
    title: "Can't Get Recovery Questions",
    message: 'Link is broken or outdated.',
    buttonText: 'CLOSE',
    redirect: ROUTES.HOME,
  },
};
