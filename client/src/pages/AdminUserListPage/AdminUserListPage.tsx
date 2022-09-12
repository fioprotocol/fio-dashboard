import React, { useState } from 'react';

import { Button, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Loader from '../../components/Loader/Loader';
// import DangerModal from '../../components/Modal/DangerModal';
import InviteModal from './components/inviteAdminUser/InviteModal';

import apis from '../../api';
import { log } from '../../util/general';
import { formatDateToLocale } from '../../helpers/stringFormatters';
import usePagination from '../../hooks/usePagination';

import { FormValuesProps, PageProps } from './types';

import classes from './AdminUserListPage.module.scss';

const AdminUserListPage: React.FC<PageProps> = props => {
  const { loading, adminUsersList, getAdminList, getAdminUserProfile } = props;

  // all commented stuff will be needed for next design updates (delete admin user case)
  // const [showModal, toggleShowModal] = useState(false);
  // const [selectedAdminUser, setSelectedAdminUser] = useState<AdminUser | null>(
  //   null,
  // );
  const [showInviteModal, toggleShowInviteModal] = useState<boolean>(false);
  const [inviteLoading, setInviteLoading] = useState<boolean>(false);

  // const closeModal = () => {
  //   toggleShowModal(false);
  //   // setSelectedAdminUser(null);
  // };

  // const openDangerModal = (adminUser: AdminUser) => {
  //   toggleShowModal(true);
  //   setSelectedAdminUser(adminUser);
  // };

  const { paginationComponent, refresh } = usePagination(getAdminList);

  const openInviteModal = () => toggleShowInviteModal(true);
  const closeInviteModal = () => toggleShowInviteModal(false);

  const inviteAdminUser = async (values: FormValuesProps) => {
    setInviteLoading(true);
    try {
      await apis.admin.inviteAdmin(values.inviteEmail).then(async () => {
        await refresh();
      });
      closeInviteModal();
    } catch (err) {
      log.error(err);
    }

    setInviteLoading(false);
  };

  const openUserProfile = async (userId: string) => {
    // todo: add separate page or Modal for userDetails actions (reset password, etc)
    await getAdminUserProfile(userId);
  };

  // const deleteUser = () => {
  //   selectedAdminUser && removeAdminUser(selectedAdminUser.id);
  // };

  // useEffect(() => {
  //   if (showModal) {
  //     closeModal();
  //   }
  // }, [adminUsersList.length]);

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
                    onClick={openUserProfile.bind(null, adminUser.id)}
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
                    {/*<th>*/}
                    {/*  <Button*/}
                    {/*    onClick={() => openDangerModal(adminUser)}*/}
                    {/*    variant="danger"*/}
                    {/*  >*/}
                    {/*    Remove*/}
                    {/*  </Button>*/}
                    {/*</th>*/}
                  </tr>
                ))
              : null}
          </tbody>
        </Table>

        {paginationComponent}

        {loading && <Loader />}
      </div>
      {/*<DangerModal*/}
      {/*  show={showModal}*/}
      {/*  onClose={closeModal}*/}
      {/*  onActionButtonClick={deleteUser}*/}
      {/*  title="Warning"*/}
      {/*  subtitle={`Are you sure you want to remove ${selectedAdminUser?.email} user?`}*/}
      {/*  buttonText="Remove"*/}
      {/*  loading={loading}*/}
      {/*/>*/}
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
