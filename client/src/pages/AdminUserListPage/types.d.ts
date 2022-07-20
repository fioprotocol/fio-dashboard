import { AdminUser, AdminUserProfile } from '../../types';

export type FormValuesProps = {
  inviteEmail: string;
};

export type PageProps = {
  loading: boolean;
  adminUsersCount: number;
  adminUsersList: AdminUser[];
  adminUserProfile?: AdminUserProfile;
  getAdminList: (limit?: number, offset?: number) => Promise<void>;
  getAdminUserProfile: (id: string) => Promise<void>;
  removeAdminUser: (adminUserId: string) => void;
};
