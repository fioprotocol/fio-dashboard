import { put, takeEvery } from 'redux-saga/effects';
import { ExportToCsv } from 'export-to-csv';

import {
  RESET_ADMIN_USER_PASSWORD_SUCCESS,
  DELETE_ADMIN_USER_SUCCESS,
  EXPORT_ORDERS_DATA_BY_ADMIN_SUCCESS,
} from './actions';
import { addManual as createNotification } from '../notifications/actions';

import { ACTIONS } from '../../components/Notifications/Notifications';
import { BADGE_TYPES } from '../../components/Badge/Badge';
import { NOTIFICATIONS_CONTENT_TYPE } from '../../constants/notifications';
import { ROUTES } from '../../constants/routes';
import {
  BC_TX_STATUS_LABELS,
  BC_TX_STATUSES,
  PAYMENT_ITEM_TYPE_LABEL,
  PAYMENT_PROVIDER_LABEL,
  PURCHASE_RESULTS_STATUS_LABELS,
} from '../../constants/purchase';

import { formatDateToLocale } from '../../helpers/stringFormatters';

import { Action } from '../types';
import { OrderDetails, OrderItem } from '../../types';

export function* resetAdminUserPasswordSuccess(): Generator {
  yield takeEvery(RESET_ADMIN_USER_PASSWORD_SUCCESS, function*() {
    yield put<Action>(
      createNotification({
        action: ACTIONS.RESET_ADMIN_USER_PASSWORD,
        type: BADGE_TYPES.SUCCESS,
        contentType: NOTIFICATIONS_CONTENT_TYPE.RESET_ADMIN_USER_PASSWORD,
        pagesToShow: [ROUTES.ADMIN_USERS],
      }),
    );
  });
}
export function* deleteAdminUserSuccess(): Generator {
  yield takeEvery(DELETE_ADMIN_USER_SUCCESS, function*() {
    yield put<Action>(
      createNotification({
        action: ACTIONS.DELETE_ADMIN_USER_SUCCESS,
        type: BADGE_TYPES.SUCCESS,
        contentType: NOTIFICATIONS_CONTENT_TYPE.DELETE_ADMIN_USER_SUCCESS,
        pagesToShow: [ROUTES.ADMIN_USERS],
      }),
    );
  });
}
export function* exportOrdersDataSuccess(): Generator {
  yield takeEvery(EXPORT_ORDERS_DATA_BY_ADMIN_SUCCESS, function(
    action: Action,
  ) {
    new ExportToCsv({
      showLabels: true,
      filename: 'orders',
      headers: [
        'Order ID',
        'Date',
        'Partner Profile',
        'User',
        'Payment Type',
        'Amount',
        'Status',
      ],
    }).generateCsv(
      action.data.orders.map((order: OrderDetails) => ({
        number: order.number,
        item: order.createdAt ? formatDateToLocale(order.createdAt) : '',
        refProfileName: order.refProfileName || 'FIO Dashboard',
        userEmail: order.userEmail,
        paymentProcessor:
          PAYMENT_PROVIDER_LABEL[order.paymentProcessor] || 'N/A',
        total: order.total || 0,
        status: PURCHASE_RESULTS_STATUS_LABELS[order.status],
      })),
    );

    new ExportToCsv({
      showLabels: true,
      filename: 'items',
      headers: ['Order ID', 'Item Type', 'Amount', 'Status'],
    }).generateCsv(
      action.data.orderItems.map((orderItem: OrderItem) => ({
        number: orderItem.order?.number,
        itemType: PAYMENT_ITEM_TYPE_LABEL[orderItem.action],
        amount: orderItem.price,
        status:
          BC_TX_STATUS_LABELS[orderItem.orderItemStatus?.txStatus] ||
          BC_TX_STATUS_LABELS[BC_TX_STATUSES.NONE],
      })),
    );
  });
}
