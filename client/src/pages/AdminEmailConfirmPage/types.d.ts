import { GeneratedSecret } from 'speakeasy';

import { AdminAuthResponse } from '../../types';

type LocationProps = {
  location: {
    query: {
      hash: string;
      email?: string;
    };
  };
};

export type InitialValues = {
  email: string;
  hash: string;
} | null;

export type FormProps = {
  onSubmit: (values: SubmitValues) => Promise<AdminAuthResponse>;
  loading: boolean;
  initialValues: InitialValues;
  downloadRecovery2FaSecret: () => void;
  tfaSecretInstance: GeneratedSecret;
};

export type PageProps = {
  confirmAdminEmail: (values: {
    email: string;
    hash: string;
    password: string;
    tfaToken: string;
    tfaSecret: string;
  }) => Promise<AdminAuthResponse>;
  loading: boolean;
};

export type SubmitValues = {
  email: string;
  password: string;
  confirmPassword: string;
  tfaToken: string;
  hash: string;
} & {
  tfaSecret: string;
};
