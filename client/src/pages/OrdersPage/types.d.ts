import { ColorTypes, UserOrderDetails } from '../../types';

export type HideButtonsProps = {
  disablePrintButton: boolean;
  disablePdfButton: boolean;
};

export type ActionsProps = {
  onDownloadClick: (data: {
    orderId: string;
    orderNumber: string;
    togglePdfLoading: (loading: boolean) => void;
  }) => Promise<void>;
  onPrintClick: (orderId: string, orderNumber: string) => Promise<void>;
};

export type OrdersPageProps = {
  hasMoreOrders: boolean;
  isDesktop: boolean;
  isNoProfileFlow: boolean;
  loading: boolean;
  ordersList: UserOrderDetails[];
  getMoreOrders: () => void;
} & ActionsProps;

export type OrderItemProps = {
  date: string;
  statusTitle?: string;
  statusColor: ColorTypes;
} & ActionsProps &
  UserOrderDetails &
  HideButtonsProps;
