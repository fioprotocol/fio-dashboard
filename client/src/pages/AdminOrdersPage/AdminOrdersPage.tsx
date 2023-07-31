import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useLocation } from 'react-router';

import Loader from '../../components/Loader/Loader';
import AdminOrderModal from './components/AdminOrderModal/AdminOrderModal';
import CustomDropdown from '../../components/CustomDropdown';

import usePagination, { DEFAULT_LIMIT } from '../../hooks/usePagination';
import { formatDateToLocale } from '../../helpers/stringFormatters';
import useEffectOnce from '../../hooks/general';

import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';
import { ADMIN_ROUTES } from '../../constants/routes';
import {
  PURCHASE_RESULTS_STATUS_LABELS,
  PAYMENT_PROVIDER_LABEL,
} from '../../constants/purchase';
import {
  ORDER_AMOUNT_FILTER_OPTIONS,
  ORDER_STATUS_FILTER_OPTIONS,
} from '../../constants/common';

import { AdminUser, OrderDetails } from '../../types';

import classes from './styles/AdminOrdersListPage.module.scss';

type Props = {
  loading: boolean;
  getOrdersList: (limit?: number, offset?: number) => Promise<void>;
  exportOrdersData: (filters: Partial<OrderDetails>) => void;
  adminUser: AdminUser;
  ordersList: OrderDetails[];
  orderItem: OrderDetails;
  ordersCount: number;
  isAuthUser: boolean;
  getOrder: (id: string) => Promise<void>;
};

const AdminOrdersPage: React.FC<Props> = props => {
  const {
    loading,
    ordersList,
    getOrdersList,
    exportOrdersData,
    getOrder,
    orderItem,
  } = props;

  const location = useLocation<{ orderId?: string }>();
  const orderId = location?.state?.orderId;

  const [filters, setFilters] = useState<Partial<OrderDetails>>({
    status: null,
    total: '',
  });
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [selectedOrderItemId, setSelectedOrderItemId] = useState<string | null>(
    null,
  );

  const handleChangeStatusFilter = useCallback((newValue: string) => {
    setFilters(filters => ({
      ...filters,
      status: +newValue,
    }));
  }, []);

  const handleChangeAmountFilter = useCallback((newValue: string) => {
    setFilters(filters => ({
      ...filters,
      total: newValue,
    }));
  }, []);

  const { paginationComponent, range } = usePagination(
    getOrdersList,
    DEFAULT_LIMIT,
    filters,
  );

  const closeOrderDetails = () => {
    setShowOrderDetailsModal(false);
    setSelectedOrderItemId(null);
  };

  const openOrderDetails = async (orderId: string) => {
    await getOrder(orderId);
    setSelectedOrderItemId(orderId);
    setShowOrderDetailsModal(true);
  };

  const onClick = (orderId: string) => {
    openOrderDetails(orderId);
  };

  const handleExportOrderData = useCallback(() => {
    exportOrdersData(filters);
  }, [exportOrdersData, filters]);

  useEffectOnce(
    () => {
      onClick(orderId);
    },
    [orderId],
    orderId != null,
  );

  return (
    <>
      <div className={classes.tableContainer}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="mr-4">
            <Button
              onClick={handleExportOrderData}
              disabled={loading}
              className="mb-4 d-flex flex-direction-row align-items-center"
            >
              <FontAwesomeIcon icon="download" className="mr-2" />{' '}
              {loading ? (
                <>
                  <span className="mr-3">Exporting...</span>
                  <Loader isWhite hasInheritFontSize hasSmallSize />
                </>
              ) : (
                'Export'
              )}
            </Button>
          </div>

          <div className="d-flex">
            <div className="d-flex align-items-center mr-2">
              Filter Amount:&nbsp;
              <CustomDropdown
                value={filters.total}
                options={ORDER_AMOUNT_FILTER_OPTIONS}
                onChange={handleChangeAmountFilter}
                isDark
                withoutMarginBottom
                fitContentWidth
                isSmall
                placeholder="All"
              />
            </div>
            <div className="d-flex align-items-center">
              Filter Status:&nbsp;
              <CustomDropdown
                value={filters.status ? filters.status.toString() : ''}
                options={ORDER_STATUS_FILTER_OPTIONS}
                onChange={handleChangeStatusFilter}
                isDark
                withoutMarginBottom
                fitContentWidth
                isSmall
                placeholder="All"
              />
            </div>
          </div>
        </div>
        <Table className="table" striped={true}>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Date</th>
              <th scope="col">Order</th>
              <th scope="col">User</th>
              <th scope="col">Amount</th>
              <th scope="col">Ref Profile</th>
              <th scope="col">Payment</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {ordersList?.length
              ? ordersList.map((order, i) => (
                  <tr
                    key={order.id}
                    className={classes.orderItem}
                    onClick={() => onClick(order.id)}
                  >
                    <th>{range[i]}</th>
                    <th>
                      {' '}
                      {order.createdAt
                        ? formatDateToLocale(order.createdAt)
                        : null}
                    </th>
                    <th>{order.number}</th>
                    <th>
                      <Link
                        to={`${ADMIN_ROUTES.ADMIN_REGULAR_USER_DETAILS}?${
                          QUERY_PARAMS_NAMES.USER_ID
                        }=${order.user ? order.user.id : order.userId}`}
                      >
                        {order.user ? order.user.email : order.userEmail}
                      </Link>
                    </th>
                    <th>{order.total || 0}</th>
                    <th>{order.refProfileName || 'FIO Dashboard'}</th>
                    <th>
                      {PAYMENT_PROVIDER_LABEL[order.paymentProcessor] || 'N/A'}
                    </th>
                    <th>{PURCHASE_RESULTS_STATUS_LABELS[order.status]}</th>
                  </tr>
                ))
              : null}
          </tbody>
        </Table>

        {paginationComponent}

        <AdminOrderModal
          isVisible={
            showOrderDetailsModal && selectedOrderItemId === orderItem?.id
          }
          onClose={closeOrderDetails}
          orderItem={orderItem}
        />

        {loading && <Loader />}
      </div>
    </>
  );
};

export default AdminOrdersPage;
