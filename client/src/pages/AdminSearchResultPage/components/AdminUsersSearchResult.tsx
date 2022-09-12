import React, { useState } from 'react';
import { Table } from 'react-bootstrap';

import AdminUserModal from './AdminUserModal/AdminUserModal';

import { formatDateToLocale } from '../../../helpers/stringFormatters';

import { AdminUserItemProfile } from '../../../types';

import classes from '.././AdminSearchResultPage.module.scss';

type Props = {
  users?: AdminUserItemProfile[];
};

const AdminUsersSearchResult: React.FC<Props> = props => {
  const { users } = props;

  const [userItem, setUserItem] = useState<AdminUserItemProfile | null>(null);

  const closeUserDetails = () => {
    setUserItem(null);
  };

  const openUserDetails = async (user: AdminUserItemProfile) => {
    setUserItem(user);
  };

  if (!users?.length) return null;

  return (
    <div>
      <div className="my-3">
        <div className={classes.itemTitle}>Users</div>
        <Table className="table" striped={true}>
          <thead>
            <tr>
              <th scope="col">Created</th>
              <th scope="col">User</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr
                key={user.id}
                className={classes.userItem}
                onClick={openUserDetails.bind(null, user)}
              >
                <th>
                  {user.createdAt ? formatDateToLocale(user.createdAt) : null}
                </th>
                <th>{user.email}</th>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <AdminUserModal
        isVisible={!!userItem}
        onClose={closeUserDetails}
        userItem={userItem}
      />
    </div>
  );
};

export default AdminUsersSearchResult;
