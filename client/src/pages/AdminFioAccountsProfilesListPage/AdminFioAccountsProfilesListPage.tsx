import React, { useCallback, useMemo, useState } from 'react';

import { Button, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import isEmpty from 'lodash/isEmpty';

import InfoBadge from '../../components/InfoBadge/InfoBadge';
import { BADGE_TYPES } from '../../components/Badge/Badge';
import Loader from '../../components/Loader/Loader';
import DangerModal from '../../components/Modal/DangerModal/DangerModal';
import FioAccountProfileModal from './components/createNewFioAccountProfile/FioAccountProfileModal';

import { FIO_ACCOUNT_TYPES, NOT_DELETABLE_ACCOUNTS } from '../../constants/fio';

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
  const [showWarningModal, toggleShowWarningModal] = useState<boolean>(false);
  const [showDeleteModal, toggleShowDeleteModal] = useState<boolean>(false);

  const { paginationComponent, refresh } = usePagination(
    getFioAccountsProfilesList,
  );

  const openFioAccountProfileModal = () => setShowFioAccountProfileModal(true);
  const closeFioAccountProfileModal = () => {
    setShowFioAccountProfileModal(false);
    setEditProfileData(null);
  };

  const editProfileDataExists = !isEmpty(editProfileData);

  const accountTypeAlreadyUsed = useCallback(
    (accountType: string) =>
      fioAccountsProfilesList.some(
        fioAccountProfile =>
          fioAccountProfile.accountType === accountType &&
          accountType !== FIO_ACCOUNT_TYPES.REGULAR,
      ),
    [fioAccountsProfilesList],
  );

  const createFioAccountProfile = useCallback(
    async (values: FormValuesProps) => {
      values = {
        ...values,
        domains: values.domains?.filter(domain => !!domain),
      };
      setFioAccountProfileActionLoading(true);
      try {
        await (editProfileDataExists
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
    },
    [editProfileDataExists, refresh],
  );

  const onSubmit = useCallback(
    async (values: FormValuesProps) => {
      const showWarningModal = editProfileDataExists
        ? editProfileData.accountType !== values.accountType
          ? accountTypeAlreadyUsed(values.accountType)
          : null
        : accountTypeAlreadyUsed(values.accountType);

      if (showWarningModal) {
        toggleShowWarningModal(true);
        return;
      }

      await createFioAccountProfile(values);
    },
    [
      editProfileDataExists,
      accountTypeAlreadyUsed,
      editProfileData?.accountType,
      createFioAccountProfile,
    ],
  );

  const dangerModaActionClick = useCallback(
    async (values: FormValuesProps) => {
      toggleShowWarningModal(false);

      await createFioAccountProfile(values);
    },
    [createFioAccountProfile],
  );

  const openProfile = useCallback(
    async (fioAccountProfile: FioAccountProfile) => {
      setEditProfileData(fioAccountProfile);
      openFioAccountProfileModal();
    },
    [],
  );

  const handleDeleteFioAccountProfile = useCallback(
    (fioAccountProfile: FioAccountProfile) => {
      toggleShowDeleteModal(true);
      setEditProfileData(fioAccountProfile);
    },
    [],
  );

  const onDeleteClose = useCallback(() => {
    toggleShowDeleteModal(false);
    setEditProfileData(null);
  }, []);

  const deleteFioAccountProfile = useCallback(
    (fioAccountProfileId: string) => {
      const deleteFioAccountProfile = async () => {
        try {
          await apis.admin.deleteFioAccountProfile(fioAccountProfileId);
          await refresh();
        } catch (err) {
          log.error(err);
        }
      };
      deleteFioAccountProfile();
    },
    [refresh],
  );

  const onDeleteActionClick = useCallback(async () => {
    deleteFioAccountProfile(editProfileData.id);
    toggleShowDeleteModal(false);
    setEditProfileData(null);
  }, [deleteFioAccountProfile, editProfileData?.id]);

  const initialValues = useMemo(
    () =>
      isEmpty(editProfileData)
        ? undefined
        : {
            ...editProfileData,
            accountType: editProfileData.accountType
              ? editProfileData.accountType
              : FIO_ACCOUNT_TYPES.REGULAR,
          },
    [editProfileData],
  );

  const missedAccountTypes = useMemo(
    () =>
      Object.keys(FIO_ACCOUNT_TYPES)
        .filter(fioAccountType => fioAccountType !== FIO_ACCOUNT_TYPES.REGULAR) // We don't care about non required type which is REGULAR
        .filter(fioAccountType => !accountTypeAlreadyUsed(fioAccountType)),
    [accountTypeAlreadyUsed],
  );

  return (
    <>
      <div className={classes.tableContainer}>
        <Button className="mb-4" onClick={openFioAccountProfileModal}>
          <FontAwesomeIcon icon="plus-square" className="mr-2" /> Add New
          Account
        </Button>
        <div className={classes.infoBadge}>
          <InfoBadge
            show={!!missedAccountTypes.length}
            type={BADGE_TYPES.ERROR}
            title="Attention"
            message={
              <span>
                For correct work you need to set up{' '}
                {missedAccountTypes.length &&
                  missedAccountTypes.map((missedAccountType, i) => (
                    <span className="boldText" key={missedAccountType}>
                      {i + 1}. {missedAccountType.replace('_', ' ')}
                      {i + 1 !== missedAccountTypes.length ? ', ' : '.'}
                    </span>
                  ))}
              </span>
            }
          />
        </div>
        <Table className="table" striped={true}>
          <thead>
            <tr>
              <th scope="col">Profile</th>
              <th scope="col">Actor</th>
              <th scope="col">Permission</th>
              <th scope="col">Type</th>
              <th scope="col">Created</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fioAccountsProfilesList?.length
              ? fioAccountsProfilesList
                  .sort((a, b) => {
                    if (a.accountType === FIO_ACCOUNT_TYPES.FREE) return -1;
                    if (b.accountType === FIO_ACCOUNT_TYPES.FREE) return 1;

                    if (a.accountType === FIO_ACCOUNT_TYPES.FREE_FALLBACK)
                      return -1;
                    if (b.accountType === FIO_ACCOUNT_TYPES.FREE_FALLBACK)
                      return 1;

                    if (a.accountType === FIO_ACCOUNT_TYPES.PAID) return -1;
                    if (b.accountType === FIO_ACCOUNT_TYPES.PAID) return 1;

                    if (a.accountType === FIO_ACCOUNT_TYPES.PAID_FALLBACK)
                      return -1;
                    if (b.accountType === FIO_ACCOUNT_TYPES.PAID_FALLBACK)
                      return 1;

                    return 0;
                  })
                  .map((fioAccountProfile, i) => (
                    <tr
                      key={fioAccountProfile.id}
                      onClick={openProfile.bind(null, fioAccountProfile)}
                      className={classes.userItem}
                    >
                      <th>{fioAccountProfile.name}</th>
                      <th>{fioAccountProfile.actor}</th>
                      <th>{fioAccountProfile.permission}</th>
                      <th>
                        {fioAccountProfile.accountType
                          ? fioAccountProfile.accountType.replace('_', ' ')
                          : 'Regular'}
                      </th>
                      <th>
                        {fioAccountProfile.createdAt
                          ? formatDateToLocale(fioAccountProfile.createdAt)
                          : null}
                      </th>
                      <th>
                        {!NOT_DELETABLE_ACCOUNTS.includes(
                          fioAccountProfile.accountType,
                        ) && (
                          <Button
                            onClick={event => {
                              event.preventDefault();
                              event.stopPropagation();
                              handleDeleteFioAccountProfile(fioAccountProfile);
                            }}
                            variant="danger"
                            disabled={fioAccountProfile.referenceToPartners}
                          >
                            Delete
                          </Button>
                        )}
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
        initialValues={initialValues}
        show={showFioAccountProfileModal}
        onSubmit={onSubmit}
        loading={fioAccountProfileActionLoading}
        onClose={closeFioAccountProfileModal}
        showWarningModal={showWarningModal}
        dangerModaActionClick={dangerModaActionClick}
        toggleShowWarningModal={toggleShowWarningModal}
      />

      <DangerModal
        show={showDeleteModal}
        title="Warning!"
        subtitle={`You are trying to delete ${editProfileData?.name} account profile. Are You Sure?`}
        onClose={onDeleteClose}
        buttonText="Yes"
        cancelButtonText="No"
        showCancel
        onActionButtonClick={onDeleteActionClick}
      />
    </>
  );
};

export default AdminFioAccountsProfilesListPage;
