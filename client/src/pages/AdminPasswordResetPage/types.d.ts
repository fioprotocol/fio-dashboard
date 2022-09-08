import { AdminAuthResponse } from '../../types';

type MatchParams = {
  hash: string;
};

export type InitialValues = {
  email: string;
  hash: string;
} | null;

export type FormProps = {
  onSubmit: (values: SubmitValues) => Promise<AdminAuthResponse>;
  loading: boolean;
  initialValues: InitialValues;
};

export type SubmitValues = {
  email: string;
  password: string;
  confirmPassword: string;
  hash: string;
};
