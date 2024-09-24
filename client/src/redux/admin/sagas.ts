import { put, takeEvery } from 'redux-saga/effects';
import { ExportToCsv } from 'export-to-csv';

import { FIOSDK } from '@fioprotocol/fiosdk';

import {
  RESET_ADMIN_USER_PASSWORD_SUCCESS,
  DELETE_ADMIN_USER_SUCCESS,
  EXPORT_ORDERS_DATA_BY_ADMIN_SUCCESS,
} from './actions';
import { addManual as createNotification } from '../notifications/actions';

import { ACTIONS } from '../../components/Notifications/Notifications';
import { BADGE_TYPES } from '../../components/Badge/Badge';
import { NOTIFICATIONS_CONTENT_TYPE } from '../../constants/notifications';
import { ADMIN_ROUTES } from '../../constants/routes';
import {
  BC_TX_STATUS_LABELS,
  BC_TX_STATUSES,
  PAYMENT_ITEM_TYPE_LABEL,
  PAYMENT_PROVIDER_LABEL,
  PURCHASE_RESULTS_STATUS_LABELS,
} from '../../constants/purchase';
import { ORDER_USER_TYPES_TITLE } from '../../constants/order';

import { transformOrderItems } from '../../util/purchase';
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
        pagesToShow: [ADMIN_ROUTES.ADMIN_USERS],
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
        pagesToShow: [ADMIN_ROUTES.ADMIN_USERS],
      }),
    );
  });
}
export function* exportOrdersDataSuccess(): Generator {
  yield takeEvery(EXPORT_ORDERS_DATA_BY_ADMIN_SUCCESS, function(
    action: Action,
  ) {
    const currentDate = new Date();

    new ExportToCsv({
      showLabels: true,
      filename: `OrdersList_Total-${action.data.orders
        .length as number}_${currentDate.getFullYear()}-${currentDate.getMonth() +
        1}-${currentDate.getDate()}_${currentDate.getHours()}-${currentDate.getMinutes()}`,
      headers: [
        'Order ID',
        'Type',
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
        type: order.orderUserType
          ? ORDER_USER_TYPES_TITLE[order.orderUserType]
          : ORDER_USER_TYPES_TITLE.DASHBOARD,
        item: order.createdAt ? formatDateToLocale(order.createdAt) : '',
        refProfileName: order.refProfileName || 'FIO App',
        userEmail: order.userEmail || order.userId,
        paymentProcessor:
          PAYMENT_PROVIDER_LABEL[order.paymentProcessor] || 'N/A',
        total: order.total || 0,
        status: PURCHASE_RESULTS_STATUS_LABELS[order.status],
      })),
    );

    new ExportToCsv({
      showLabels: true,
      filename: `ItemsList_Total-${action.data.orderItems
        .length as number}_${currentDate.getFullYear()}-${currentDate.getMonth() +
        1}-${currentDate.getDate()}_${currentDate.getHours()}-${currentDate.getMinutes()}`,
      headers: [
        'Order ID',
        'Item Type',
        'Amount',
        'FIO',
        'Fee Collected',
        'Status',
      ],
    }).generateCsv(
      transformOrderItems(action.data.orderItems).map(
        (orderItem: OrderItem) => ({
          number: orderItem.order?.number,
          itemType: PAYMENT_ITEM_TYPE_LABEL[orderItem.action],
          amount: `${orderItem.price} ${orderItem.priceCurrency}`,
          fio:
            orderItem.price === '0'
              ? '0'
              : FIOSDK.SUFToAmount(orderItem.nativeFio).toFixed(2),
          feeCollected: `${orderItem.feeCollected} FIO`,
          status:
            BC_TX_STATUS_LABELS[orderItem.orderItemStatus?.txStatus] ||
            BC_TX_STATUS_LABELS[BC_TX_STATUSES.NONE],
        }),
      ),
    );
  });
}
