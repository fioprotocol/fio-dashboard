import { Notification, User } from '../../types';

export type NotificationsContainer = {
  list: Notification[];
  user: User;
  update: ({ id: number, closeDate: Date }) => void;
  listNotifications: () => void;
  removeManual: ({ id: number, closeDate: Date }) => void;
  showRecoveryModal: () => void;
};
