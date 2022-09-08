import React from 'react';

import { Button, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Loader from '../../components/Loader/Loader';
import InviteModal from './components/inviteAdminUser/InviteModal';
import EditModal from './components/editAdminUser/EditModal';

import { formatDateToLocale } from '../../helpers/stringFormatters';

import { useContext } from './AdminUserListPageContext';

import classes from './AdminUserListPage.module.scss';

const AdminUserListPage: React.FC = () => {
  const {
    adminUsersList,
    isAdminLoading,
    adminUserProfile,
    currentAdminUserId,
    removeAdminUser,
    resetAdminUserPassword,
    inviteAdminUser,
    showEditModal,
    showInviteModal,
    inviteLoading,
    openInviteModal,
    closeInviteModal,
    openEditUserModal,
    closeEditUserModal,
    paginationComponent,
  } = useContext();

  return (
    <>
      <div className={classes.tableContainer}>
        <Button className="mb-4" onClick={openInviteModal}>
          <FontAwesomeIcon icon="plus-square" className="mr-2" /> Invite User
        </Button>
        <Table className="table" striped={true}>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Email</th>
              <th scope="col">Status</th>
              <th scope="col">Role</th>
              <th scope="col">Registered</th>
              <th scope="col">Last Login</th>
            </tr>
          </thead>
          <tbody>
            {adminUsersList?.length
              ? adminUsersList.map((adminUser, i) => (
                  <tr
                    key={adminUser.id}
                    onClick={() => openEditUserModal(adminUser.id)}
                    className={classes.userItem}
                  >
                    <th>{i + 1}</th>
                    <th>{adminUser.email}</th>
                    <th>{adminUser.status.status}</th>
                    <th>{adminUser.role.role}</th>
                    <th>
                      {adminUser.createdAt
                        ? formatDateToLocale(adminUser.createdAt)
                        : null}
                    </th>
                    <th>
                      {adminUser.lastLogIn
                        ? formatDateToLocale(adminUser.lastLogIn)
                        : null}
                    </th>
                  </tr>
                ))
              : null}
          </tbody>
        </Table>

        {paginationComponent}

        {isAdminLoading && <Loader />}
      </div>
      <EditModal
        show={showEditModal}
        loading={isAdminLoading}
        adminUser={adminUserProfile}
        isCurrentUser={currentAdminUserId === adminUserProfile?.id}
        onClose={closeEditUserModal}
        onDelete={removeAdminUser}
        onResetPassword={resetAdminUserPassword}
      />
      <InviteModal
        show={showInviteModal}
        onSubmit={inviteAdminUser}
        loading={inviteLoading}
        onClose={closeInviteModal}
      />
    </>
  );
};

export default AdminUserListPage;
