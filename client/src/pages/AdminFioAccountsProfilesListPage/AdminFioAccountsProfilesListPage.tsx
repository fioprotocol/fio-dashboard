import React, { useState } from 'react';

import { Button, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Loader from '../../components/Loader/Loader';
import FioAccountProfileModal from './components/createNewFioAccountProfile/FioAccountProfileModal';

import apis from '../../api';
import { log } from '../../util/general';
import { formatDateToLocale } from '../../helpers/stringFormatters';
import usePagination from '../../hooks/usePagination';

import { FormValuesProps, PageProps } from './types';
import { FioAccountProfile } from '../../types';

import classes from './AdminFioAccountsProfilesListPage.module.scss';

const AdminFioAccountsProfilesListPage: React.FC<PageProps> = props => {
  const {
    loading,
    fioAccountsProfilesList,
    getFioAccountsProfilesList,
  } = props;

  const [showFioAccountProfileModal, setShowFioAccountProfileModal] = useState<
    boolean
  >(false);
  const [
    fioAccountProfileActionLoading,
    setFioAccountProfileActionLoading,
  ] = useState<boolean>(false);
  const [
    editProfileData,
    setEditProfileData,
  ] = useState<FioAccountProfile | null>(null);

  const { paginationComponent, refresh } = usePagination(
    getFioAccountsProfilesList,
  );

  const openFioAccountProfileModal = () => setShowFioAccountProfileModal(true);
  const closeFioAccountProfileModal = () => {
    setShowFioAccountProfileModal(false);
    setEditProfileData(null);
  };

  const createFioAccountProfile = async (values: FormValuesProps) => {
    setFioAccountProfileActionLoading(true);
    try {
      await (editProfileData
        ? apis.admin.editFioAccountProfile(values, values.id)
        : apis.admin.createFioAccountProfile(values)
      ).then(async () => {
        await refresh();
      });
      closeFioAccountProfileModal();
    } catch (err) {
      log.error(err);
    }

    setFioAccountProfileActionLoading(false);
  };

  const openProfile = async (fioAccountProfile: FioAccountProfile) => {
    setEditProfileData(fioAccountProfile);
    openFioAccountProfileModal();
  };

  return (
    <>
      <div className={classes.tableContainer}>
        <Button className="mb-4" onClick={openFioAccountProfileModal}>
          <FontAwesomeIcon icon="plus-square" className="mr-2" /> Add New
          Account
        </Button>
        <Table className="table" striped={true}>
          <thead>
            <tr>
              <th scope="col">Profile</th>
              <th scope="col">Actor</th>
              <th scope="col">Permission</th>
              <th scope="col">Created</th>
            </tr>
          </thead>
          <tbody>
            {fioAccountsProfilesList?.length
              ? fioAccountsProfilesList.map((fioAccountProfile, i) => (
                  <tr
                    key={fioAccountProfile.id}
                    onClick={openProfile.bind(null, fioAccountProfile)}
                    className={classes.userItem}
                  >
                    <th>{fioAccountProfile.name}</th>
                    <th>{fioAccountProfile.actor}</th>
                    <th>{fioAccountProfile.permission}</th>
                    <th>
                      {fioAccountProfile.createdAt
                        ? formatDateToLocale(fioAccountProfile.createdAt)
                        : null}
                    </th>
                  </tr>
                ))
              : null}
          </tbody>
        </Table>

        {paginationComponent}

        {loading && <Loader />}
      </div>

      <FioAccountProfileModal
        initialValues={editProfileData}
        show={showFioAccountProfileModal}
        onSubmit={createFioAccountProfile}
        loading={fioAccountProfileActionLoading}
        onClose={closeFioAccountProfileModal}
      />
    </>
  );
};

export default AdminFioAccountsProfilesListPage;
