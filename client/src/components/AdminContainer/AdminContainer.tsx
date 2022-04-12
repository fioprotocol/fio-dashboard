import React from 'react';
import { Link, Redirect } from 'react-router-dom';

import { ROUTES } from '../../constants/routes';

type Props = {
  isAdmin: boolean;
};

const AdminContainer: React.FC<Props> = props => {
  if (!props.isAdmin) {
    return <Redirect to={{ pathname: ROUTES.HOME }} />;
  }

  return (
    <div>
      <Link to={ROUTES.ADMIN_USERS}>Users</Link>
    </div>
  );
};

export default AdminContainer;
