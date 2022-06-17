import React, { useEffect, useState } from 'react';

import { Button, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Loader from '../../components/Loader/Loader';
import DangerModal from '../../components/Modal/DangerModal';
import InviteModal from './components/InviteModal';

import apis from '../../api';

import { log } from '../../util/general';

import { AdminUser } from '../../types';
import { FormValuesProps } from './types';

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
  const [showInviteModal, toggleShowInviteModal] = useState<boolean>(false);
  const [inviteLoading, setInviteLoading] = useState<boolean>(false);

  const closeModal = () => {
    toggleShowModal(false);
    setSelectedAdminUser(null);
  };

  const openDangerModal = (adminUser: AdminUser) => {
    toggleShowModal(true);
    setSelectedAdminUser(adminUser);
  };

  const openInviteModal = () => toggleShowInviteModal(true);
  const closeInviteModal = () => toggleShowInviteModal(false);

  const inviteAdminUser = async (values: FormValuesProps) => {
    setInviteLoading(true);
    try {
      await apis.admin.invite(values.inviteEmail);
      closeInviteModal();
    } catch (err) {
      log.error(err);
    }

    setInviteLoading(false);
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
