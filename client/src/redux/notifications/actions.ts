import { Api } from '../../api';
import { CommonAction, CommonPromiseAction } from '../types';
import { NotificationParams } from '../../types';

export const prefix = 'notifications';

export const LIST_REQUEST = `${prefix}/LIST_REQUEST`;
export const LIST_SUCCESS = `${prefix}/LIST_SUCCESS`;
export const LIST_FAILURE = `${prefix}/LIST_FAILURE`;

export const listNotifications = (query?: {
  type: string;
  contentType: string;
  createdAt: string;
}): CommonPromiseAction => ({
  types: [LIST_REQUEST, LIST_SUCCESS, LIST_FAILURE],
  promise: (api: Api) => api.notifications.list(query),
});

export const CREATE_REQUEST = `${prefix}/CREATE_REQUEST`;
export const CREATE_SUCCESS = `${prefix}/CREATE_SUCCESS`;
export const CREATE_FAILURE = `${prefix}/CREATE_FAILURE`;

export const createNotification = (
  data: NotificationParams,
): CommonPromiseAction => ({
  types: [CREATE_REQUEST, CREATE_SUCCESS, CREATE_FAILURE],
  promise: (api: Api) => api.notifications.create(data),
});

export const UPDATE_REQUEST = `${prefix}/UPDATE_REQUEST`;
export const UPDATE_SUCCESS = `${prefix}/UPDATE_SUCCESS`;
export const UPDATE_FAILURE = `${prefix}/UPDATE_FAILURE`;

export const updateNotification = ({
  id,
  closeDate,
}: {
  id: number;
  closeDate: string;
}): CommonPromiseAction => ({
  types: [UPDATE_REQUEST, UPDATE_SUCCESS, UPDATE_FAILURE],
  promise: (api: Api) => api.notifications.update({ id, closeDate }),
  id,
});

export const MANUAL_CREATE = `${prefix}/MANUAL_CREATE`;
export const MANUAL_REMOVE = `${prefix}/MANUAL_REMOVE`;

export const addManual = (data: {
  type: string;
  action: string;
  contentType?: string;
  title?: string;
  message?: string;
  pagesToShow: string[];
}): CommonAction => ({
  type: MANUAL_CREATE,
  data: {
    ...data,
    id: new Date().getTime(),
    isManual: true,
    createdAt: new Date(),
  },
});

export const removeManual = (data: {
  id: number;
  closeDate: string;
}): CommonAction => ({
  type: MANUAL_REMOVE,
  data,
});
