import React from 'react';

import { AdminChangePasswrod } from './components/AdminChangePassword';
import { AdminChangeTfaToken } from './components/AdminChangeTfaToken';

import { formatDateToLocale } from '../../helpers/stringFormatters';
import { AdminUser } from '../../types';

import classes from './AdminProfilePage.module.scss';

type Props = {
  adminUser: AdminUser;
  isAuthUser: boolean;
};

const AdminPage: React.FC<Props> = props => {
  const { adminUser } = props;

  if (adminUser)
    return (
      <div className={classes.container}>
        <div className={classes.profileContainer}>
          <div className="d-flex justify-content-between">
            <div className="mr-3">
              <b>Email</b>
            </div>
            <div>{adminUser.email}</div>
          </div>
          <div className="d-flex justify-content-between">
            <div className="mr-3">
              <b>Last LogIn:</b>
            </div>
            <div>{formatDateToLocale(adminUser.lastLogIn)}</div>
          </div>
          <div className="d-flex justify-content-between">
            <div className="mr-3">
              <b>Created:</b>
            </div>
            <div>{formatDateToLocale(adminUser.createdAt)}</div>
          </div>
          <div className="d-flex justify-content-between">
            <div className="mr-3">
              <b>Role:</b>
            </div>
            <div>{adminUser.role.role}</div>
          </div>
          <div className="d-flex justify-content-between">
            <div className="mr-3">
              <b>Status:</b>
            </div>
            <div>{adminUser.status.status}</div>
          </div>
        </div>
        <div className={classes.actionContainer}>
          <h4>Actions</h4>
          <hr />
          <div className={classes.actions}>
            <AdminChangePasswrod />
            <AdminChangeTfaToken />
          </div>
        </div>
      </div>
    );

  return null;
};

export default AdminPage;
