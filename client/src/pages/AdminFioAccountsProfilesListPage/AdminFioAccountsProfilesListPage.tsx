import React, { useCallback, useMemo, useState } from 'react';

import { Button, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import isEmpty from 'lodash/isEmpty';

import InfoBadge from '../../components/InfoBadge/InfoBadge';
import { BADGE_TYPES } from '../../components/Badge/Badge';
import Loader from '../../components/Loader/Loader';
import FioAccountProfileModal from './components/createNewFioAccountProfile/FioAccountProfileModal';

import { FIO_ACCOUNT_TYPES } from '../../constants/fio';

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

  const { paginationComponent, refresh } = usePagination(
    getFioAccountsProfilesList,
  );

  const openFioAccountProfileModal = () => setShowFioAccountProfileModal(true);
  const closeFioAccountProfileModal = () => {
    setShowFioAccountProfileModal(false);
    setEditProfileData(null);
  };

  const editProfileDataExist = !isEmpty(editProfileData);

  const accountTypeAlreadyUsed = useCallback(
    (accountType: string) =>
      fioAccountsProfilesList.some(
        fioAccountProfile => fioAccountProfile.accountType === accountType,
      ),
    [fioAccountsProfilesList],
  );

  const createFioAccountProfile = useCallback(
    async (values: FormValuesProps) => {
      setFioAccountProfileActionLoading(true);
      try {
        await (editProfileDataExist
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
    [editProfileDataExist, refresh],
  );

  const onSubmit = useCallback(
    async (values: FormValuesProps) => {
      if (accountTypeAlreadyUsed(values.accountType)) {
        toggleShowWarningModal(true);
        return;
      }

      await createFioAccountProfile(values);
    },
    [createFioAccountProfile, accountTypeAlreadyUsed],
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
    </>
  );
};

export default AdminFioAccountsProfilesListPage;
