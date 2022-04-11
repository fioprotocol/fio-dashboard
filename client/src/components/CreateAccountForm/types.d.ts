export type FormValues = {
  email: string;
  password: string;
  confirmPassword: string;
  pin: string;
  confirmPin: string;
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
  password?: string;
  confirmPassword?: string;
};
