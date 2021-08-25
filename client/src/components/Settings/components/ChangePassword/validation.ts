type Props = {
  confirmNewPassword: string;
  currentPassword: string;
  newPassword: string;
};

const validation = (values: Props) => {
  const errors: any = {}; // todo: set error types

  const { confirmNewPassword, currentPassword, newPassword } = values;

  if (!confirmNewPassword) {
    errors.confirmNewPassword = 'Required';
  }

  if (!currentPassword) {
    errors.currentPassword = 'Required';
  }

  if (!newPassword) {
    errors.newPassword = 'Required';
  }

  return errors;
};

export default validation;
