import { PasswordFormValues } from '../../types';

export const validate = (values: PasswordFormValues) => {
  if (!values.password) return { password: 'Required' };

  return {};
};
