export type PasswordTypes = {
  password: string;
  newPassword: string;
  username: string;
};

export type FormValuesTypes = {
  confirmNewPassword: string;
} & PasswordTypes;
