export type PasswordTypes = {
  currentPassword: string;
  newPassword: string;
};

export type FormValuesTypes = {
  confirmNewPassword: string;
} & PasswordTypes;
