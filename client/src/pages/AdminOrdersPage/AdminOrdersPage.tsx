import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation } from 'react-router';
import DatePicker from 'react-datepicker';

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
  ORDER_DATE_FILTER_OPTIONS,
  ORDER_STATUS_FILTER_OPTIONS,
  ORDER_USER_TYPE_FILTER_OPTIONS,
} from '../../constants/common';
import { ORDER_USER_TYPES_TITLE } from '../../constants/order';

import {
  AdminUser,
  DateRange,
  OrderDetails,
  OrderListFilters,
} from '../../types';

import 'react-datepicker/dist/react-datepicker.css';

import classes from './styles/AdminOrdersListPage.module.scss';
import {
  localDateToUtc,
  endDayMask,
  startDayMask,
  DateRangeConditions,
  dateRangeConditions,
} from '../../util/date';
import { truncateTextInMiddle } from '../../util/general';

type Props = {
  loading: boolean;
  getOrdersList: (
    limit: number,
    offset: number,
    filters: OrderListFilters,
  ) => Promise<void>;
  exportOrdersData: (filters: OrderListFilters) => void;
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

  const [dateRange, setDateRange] = useState<[Date, Date]>([null, null]);
  const [createdAt, setCreatedAt] = useState<DateRangeConditions>(null);
  const [filters, setFilters] = useState<OrderListFilters>({
    dateRange: null,
    status: null,
    freeStatus: '',
    orderUserType: null,
  });
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState<boolean>(
    false,
  );
  const [selectedOrderItemId, setSelectedOrderItemId] = useState<string | null>(
    null,
  );
  const [showDatePicker, toggleShowDatePicker] = useState<boolean>(false);

  const openDatePicker = useCallback(() => {
    toggleShowDatePicker(true);
  }, []);

  const closeDatePicker = useCallback(() => {
    toggleShowDatePicker(false);
    setCreatedAt(null);
    setFilters(filters => ({
      ...filters,
      dateRange: null,
    }));
  }, []);

  const handleChangeStatusFilter = useCallback((newValue: string) => {
    setFilters(filters => ({
      ...filters,
      status: +newValue,
    }));
  }, []);

  const handleChangeFreeStatusFilter = useCallback((newValue: string) => {
    setFilters(filters => ({
      ...filters,
      freeStatus: newValue,
    }));
  }, []);

  const handleChangeOrderUserTypeFilter = useCallback((newValue: string) => {
    setFilters(filters => ({
      ...filters,
      orderUserType: newValue,
    }));
  }, []);

  const [startDate, endDate] = dateRange;

  const handleSetDateRangeFilter = useCallback(() => {
    setCreatedAt(null);

    const dateRange: DateRange = {};

    if (startDate) {
      dateRange.startDate = localDateToUtc({
        ms: startDate.getTime(),
        mask: startDayMask,
      });
    }

    if (endDate) {
      dateRange.endDate = localDateToUtc({
        ms: endDate.getTime(),
        mask: endDayMask,
      });
    }

    setFilters(filters => ({
      ...filters,
      dateRange,
    }));
  }, [startDate, endDate]);

  const handleChangeDateFilter = useCallback(
    (newValue: DateRangeConditions | '' | 'custom') => {
      if (newValue === '') {
        setCreatedAt(null);
        setFilters(filters => ({
          ...filters,
          dateRange: null,
        }));
      } else if (newValue === 'custom') {
        setCreatedAt(null);
        openDatePicker();
      } else {
        setCreatedAt(newValue);
        setFilters(filters => ({
          ...filters,
          dateRange: dateRangeConditions[newValue],
        }));
      }
    },
    [openDatePicker],
  );

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
                value={filters.freeStatus}
                options={ORDER_AMOUNT_FILTER_OPTIONS}
                onChange={handleChangeFreeStatusFilter}
                isDark
                withoutMarginBottom
                fitContentWidth
                isSmall
                placeholder="All"
              />
            </div>
            <div className="d-flex align-items-center mr-2">
              Filter Order User Type:&nbsp;
              <CustomDropdown
                value={filters.orderUserType}
                options={ORDER_USER_TYPE_FILTER_OPTIONS}
                onChange={handleChangeOrderUserTypeFilter}
                isDark
                withoutMarginBottom
                fitContentWidth
                isSmall
                placeholder="All"
              />
            </div>
            <div className="d-flex align-items-center mr-2">
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
            <div className="d-flex align-items-center">
              Filter Date:&nbsp;
              {showDatePicker ? (
                <div className={classes.datePickerContainer}>
                  <DatePicker
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={setDateRange}
                    isClearable={true}
                  />
                  <Button
                    className="btn btn-primary ml-2 mr-2"
                    onClick={handleSetDateRangeFilter}
                  >
                    Set Date
                  </Button>
                  <Button className="btn btn-danger" onClick={closeDatePicker}>
                    Close
                  </Button>
                </div>
              ) : (
                <CustomDropdown
                  value={createdAt}
                  options={[...ORDER_DATE_FILTER_OPTIONS]}
                  onChange={handleChangeDateFilter as (id: string) => void}
                  isDark
                  withoutMarginBottom
                  fitContentWidth
                  isSmall
                  placeholder="All"
                />
              )}
            </div>
          </div>
        </div>
        <Table className="table" striped={true}>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Date</th>
              <th scope="col">Order</th>
              <th scope="col">Type</th>
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
                      {order.orderUserType
                        ? ORDER_USER_TYPES_TITLE[order.orderUserType]
                        : ORDER_USER_TYPES_TITLE.DASHBOARD}
                    </th>
                    <th>
                      {!order?.user?.email &&
                      !order?.userId &&
                      !order?.userEmail ? (
                        order?.orderUserType && order?.orderUserType ? (
                          truncateTextInMiddle(order?.publicKey, 12, 12) ||
                          ORDER_USER_TYPES_TITLE[order.orderUserType]
                        ) : (
                          'No user data'
                        )
                      ) : (
                        <Link
                          to={`${ADMIN_ROUTES.ADMIN_REGULAR_USER_DETAILS}?${
                            QUERY_PARAMS_NAMES.USER_ID
                          }=${order.user ? order.user.id : order.userId}`}
                        >
                          {order?.user?.email ||
                            order?.userEmail ||
                            order?.userId}
                        </Link>
                      )}
                    </th>
                    <th>{order.total || 0}</th>
                    <th>{order.refProfileName || 'FIO App'}</th>
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
