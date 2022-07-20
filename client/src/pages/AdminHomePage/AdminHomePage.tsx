import React from 'react';

import { AdminUser } from '../../types';

type Props = {
  adminUser: AdminUser;
};

const AdminHomePage: React.FC<Props> = props => {
  const { adminUser } = props;

  if (!adminUser) return null;

  return <div className="">Welcome {adminUser.email}</div>;
};

export default AdminHomePage;
