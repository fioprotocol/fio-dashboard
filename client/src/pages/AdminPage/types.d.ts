import { AdminUser } from '../../types';

export type AdminPageProps = {
  adminUser: AdminUser;
  isAuthUser: boolean;
} & AdminLoginPageProps;

export type AdminLoginPageProps = {
  loading: boolean;
  login: (values: FormValues) => void;
};

export type FormValues = {
  email: string;
  password: string;
};
