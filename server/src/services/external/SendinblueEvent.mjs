import marketingSendinblue from '../../external/marketing-sendinblue.mjs';

export const sendSendinblueEvent = async ({ event, user }) => {
  if (user.isOptIn) {
    return await marketingSendinblue.sendEvent(user.email, event);
  }
};
