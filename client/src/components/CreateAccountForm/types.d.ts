export type FormValues = {
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
  addEmailToPromoList: boolean;
};

export type PasswordValidationState = {
  length: { isChecked?: boolean };
  lower: { isChecked?: boolean };
  upper: { isChecked?: boolean };
  number: { isChecked?: boolean };
};

export type PasswordValidation = { [rule: string]: boolean };
export type ValidationErrors = {
  email?: string;
  confirmEmail?: string;
  password?: string;
  confirmPassword?: string;
};
