import React from 'react';

import { AdminUser } from '../../types';

type Props = {
  adminUser: AdminUser;
  isAuthUser: boolean;
};

const AdminPage: React.FC<Props> = props => {
  const { adminUser } = props;

  if (adminUser) return <div>Hi, {adminUser.email}</div>;

  return null;
};

export default AdminPage;
