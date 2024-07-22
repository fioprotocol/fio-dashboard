import { Component, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import apis from '../../admin/api';
import { log } from '../../util/general';
import usePagination from '../../hooks/usePagination';

import {
  getAdminUserProfile,
  getAdminUsersList,
  removeAdminUser,
  resetAdminUserPassword,
} from '../../redux/admin/actions';

import {
  adminUserProfile as adminUserProfileSelector,
  adminUsersList as adminUsersListSelector,
  loading as loadingAdminSelector,
} from '../../redux/admin/selectors';
import { adminUserId as adminUserIdSelector } from '../../redux/profile/selectors';

import { FormValuesProps } from './types';
import { AdminUser, AdminUserProfile, AnyObject } from '../../types';

export const useContext = (): {
  isAdminLoading: boolean;
  adminUsersList: AdminUser[];
  adminUserProfile?: AdminUserProfile;
  currentAdminUserId: string;
  removeAdminUser: (adminUserId: string) => void;
  resetAdminUserPassword: (adminUserId: string) => void;
  inviteAdminUser: (values: FormValuesProps) => Promise<AnyObject>;
  showEditModal: boolean;
  showInviteModal: boolean;
  inviteLoading: boolean;
  openInviteModal: () => void;
  closeInviteModal: () => void;
  openEditUserModal: (userId: string) => void;
  closeEditUserModal: () => void;
  paginationComponent: Component;
} => {
  const dispatch = useDispatch();

  const isAdminLoading = useSelector(loadingAdminSelector);
  const currentAdminUserId = useSelector(adminUserIdSelector);
  const adminUserProfile = useSelector(adminUserProfileSelector);
  const adminUsersList = useSelector(adminUsersListSelector);

  const [showEditModal, toggleShowEditModal] = useState(false);
  const [showInviteModal, toggleShowInviteModal] = useState<boolean>(false);
  const [inviteLoading, setInviteLoading] = useState<boolean>(false);

  const dispatchRemoveAdminUser = useCallback(
    (adminUserId: string) => dispatch(removeAdminUser(adminUserId)),
    [dispatch],
  );
  const dispatchResetAdminUserPassword = useCallback(
    (adminUserId: string) => dispatch(resetAdminUserPassword(adminUserId)),
    [dispatch],
  );
  const getAdminList = useCallback(
    (limit: number, offset: number) =>
      dispatch(getAdminUsersList(limit, offset)),
    [dispatch],
  );

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

  const openEditUserModal = (userId: string) => {
    dispatch(getAdminUserProfile(userId));
    toggleShowEditModal(true);
  };

  const closeEditUserModal = () => {
    toggleShowEditModal(false);
  };

  return {
    isAdminLoading,
    adminUsersList,
    adminUserProfile,
    currentAdminUserId,
    removeAdminUser: dispatchRemoveAdminUser,
    resetAdminUserPassword: dispatchResetAdminUserPassword,
    inviteAdminUser,
    showEditModal,
    showInviteModal,
    inviteLoading,
    openInviteModal,
    closeInviteModal,
    openEditUserModal,
    closeEditUserModal,
    paginationComponent,
  };
};
