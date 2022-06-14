import React from 'react';
import { Redirect } from 'react-router';

import AdminLogin from './components/AdminLogin';

import { ROUTES } from '../../constants/routes';

import { AdminPageProps } from './types';

const AdminPage: React.FC<AdminPageProps> = props => {
  const { loading, login, adminUser, isAuthUser } = props;

  if (isAuthUser) return <Redirect to={ROUTES.HOME} />;

  if (adminUser) return <div>Hi, {adminUser.email}</div>;

  return <AdminLogin login={login} loading={loading} />;
};

export default AdminPage;
