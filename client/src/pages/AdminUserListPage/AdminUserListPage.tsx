import React, { useEffect, useState } from 'react';

import { Button, Table } from 'react-bootstrap';
import Pagination from 'react-bootstrap/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Loader from '../../components/Loader/Loader';
// import DangerModal from '../../components/Modal/DangerModal';
import InviteModal from './components/inviteAdminUser/InviteModal';

import apis from '../../api';
import { log } from '../../util/general';
import { formatDateToLocale } from '../../helpers/stringFormatters';

import { AdminUser, AdminUserProfile } from '../../types';
import { FormValuesProps } from './types';

import classes from './AdminUserListPage.module.scss';

type Props = {
  loading: boolean;
  adminUsersCount: number;
  adminUsersList: AdminUser[];
  adminUserProfile?: AdminUserProfile;
  getAdminList: (limit?: number, offset?: number) => Promise<void>;
  getAdminUserProfile: (id: string) => Promise<void>;
  removeAdminUser: (adminUserId: string) => void;
};

const MAX_USERS_PER_PAGE = 25;

const AdminUserListPage: React.FC<Props> = props => {
  const {
    loading,
    adminUsersList,
    getAdminList,
    getAdminUserProfile,
    adminUsersCount: usersCount = 0,
  } = props;

  const [activePage, setActivePage] = useState(1);

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

  const openInviteModal = () => toggleShowInviteModal(true);
  const closeInviteModal = () => toggleShowInviteModal(false);

  const inviteAdminUser = async (values: FormValuesProps) => {
    setInviteLoading(true);
    try {
      await apis.admin.inviteAdmin(values.inviteEmail).then(async () => {
        await getAdminList();
        setActivePage(1);
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

  useEffect(() => {
    getAdminList();
  }, [getAdminList]);

  // useEffect(() => {
  //   if (showModal) {
  //     closeModal();
  //   }
  // }, [adminUsersList.length]);

  const paginationItems = [];
  for (
    let pageNumber = 1;
    pageNumber <=
    (usersCount > MAX_USERS_PER_PAGE ? usersCount / MAX_USERS_PER_PAGE : 1);
    pageNumber++
  ) {
    paginationItems.push(
      <Pagination.Item
        key={pageNumber}
        active={pageNumber === activePage}
        onClick={() => {
          if (!(pageNumber === activePage)) {
            setActivePage(pageNumber);
            getAdminList(
              MAX_USERS_PER_PAGE,
              (pageNumber - 1) * MAX_USERS_PER_PAGE,
            );
          }
        }}
      >
        {pageNumber}
      </Pagination.Item>,
    );
  }

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

        <Pagination>{paginationItems}</Pagination>

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
