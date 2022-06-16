import React, { useEffect, useState } from 'react';

import { Button, Table } from 'react-bootstrap';

import Loader from '../../components/Loader/Loader';
import DangerModal from '../../components/Modal/DangerModal';

import { AdminUser } from '../../types';

import classes from './AdminUserListPage.module.scss';

type Props = {
  loading: boolean;
  adminUsersList: AdminUser[];
  getAdminList: () => void;
  removeAdminUser: (adminUserId: string) => void;
};

const AdminUserListPage: React.FC<Props> = props => {
  const { loading, adminUsersList, getAdminList, removeAdminUser } = props;

  const [showModal, toggleShowModal] = useState(false);
  const [selectedAdminUser, setSelectedAdminUser] = useState<AdminUser | null>(
    null,
  );

  const closeModal = () => {
    toggleShowModal(false);
    setSelectedAdminUser(null);
  };

  const openDangerModal = (adminUser: AdminUser) => {
    toggleShowModal(true);
    setSelectedAdminUser(adminUser);
  };

  const deleteUser = () => {
    selectedAdminUser && removeAdminUser(selectedAdminUser.id);
  };

  useEffect(() => {
    getAdminList();
  }, [getAdminList]);

  useEffect(() => {
    if (showModal) {
      closeModal();
    }
  }, [adminUsersList.length]);

  return (
    <>
      <div className={classes.tableContainer}>
        <Table className="table" striped={true}>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Email</th>
              <th scope="col">Status</th>
              <th scope="col">Role</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {adminUsersList.map((adminUser, i) => (
              <tr key={adminUser.id}>
                <th>{i + 1}</th>
                <th>{adminUser.email}</th>
                <th>{adminUser.status}</th>
                <th>{adminUser.role}</th>
                <th>
                  <Button
                    onClick={() => openDangerModal(adminUser)}
                    variant="danger"
                  >
                    Remove
                  </Button>
                </th>
              </tr>
            ))}
          </tbody>
        </Table>
        {loading && <Loader />}
      </div>
      <DangerModal
        show={showModal}
        onClose={closeModal}
        onActionButtonClick={deleteUser}
        title="Warning"
        subtitle={`Are you sure you want to remove ${selectedAdminUser?.email} user?`}
        buttonText="Remove"
        loading={loading}
      />
    </>
  );
};

export default AdminUserListPage;
