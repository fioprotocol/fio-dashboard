import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactDOMServer from 'react-dom/server';

import { OrderDetailedPdf } from '../../components/OrderDetailedPdf/OrderDetailedPdf';

import apis from '../../api';

import { useEffectOnce } from '../../hooks/general';
import useQuery from '../../hooks/useQuery';

import { firePageViewAnalyticsEvent } from '../../util/analytics';
import { log } from '../../util/general';
import { generateOrderHtmlToPrint } from '../../util/order';
import { getPagePrintScreenDimensions } from '../../util/screen';

import { useCheckIfDesktop } from '../../screenType';

import { getUserOrdersList } from '../../redux/orders/actions';

import { APP_TITLE, LINK_TITLES } from '../../constants/labels';
import { ROUTES } from '../../constants/routes';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';
import { REF_PROFILE_SLUG_NAME } from '../../constants/ref';

import {
  totalOrdersCount as totalOrdersCountSelector,
  loading as loadingSelector,
  ordersList as ordersListSelector,
} from '../../redux/orders/selectors';
import {
  isNoProfileFlow as isNoProfileFlowSelector,
  refProfileCode as refProfileCodeSelector,
} from '../../redux/refProfile/selectors';
import { userId as userIdSelector } from '../../redux/profile/selectors';

import { OrdersPageProps } from './types';

const ORDERS_ITEMS_LIMIT = 25;

export const useContext = (): OrdersPageProps => {
  const totalOrdersCount = useSelector(totalOrdersCountSelector);
  const ordersList = useSelector(ordersListSelector);
  const loading = useSelector(loadingSelector);
  const dispatch = useDispatch();
  const refProfileCode = useSelector(refProfileCodeSelector);
  const isNoProfileFlow = useSelector(isNoProfileFlowSelector);
  const userId = useSelector(userIdSelector);

  const [offset, setOffset] = useState<number>(0);

  const queryParams = useQuery();

  const publicKey = queryParams.get(QUERY_PARAMS_NAMES.PUBLIC_KEY);

  const noProfileRedirectParams = {
    pathname: `${ROUTES.NO_PROFILE_REGISTER_FIO_HANDLE.replace(
      REF_PROFILE_SLUG_NAME,
      refProfileCode,
    )}`,
  };

  const isDesktop = useCheckIfDesktop();
  const hasMoreOrders = totalOrdersCount - ordersList.length > 0;

  const getMoreOrders = useCallback(() => {
    if (!userId && !publicKey) {
      return;
    }

    dispatch(
      getUserOrdersList({
        limit: ORDERS_ITEMS_LIMIT,
        offset,
        publicKey,
      }),
    );
    setOffset(offset + ORDERS_ITEMS_LIMIT);
  }, [dispatch, offset, publicKey, userId]);

  const getOrder = async (orderId: string) => {
    const orderItem = ordersList.find(it => it.id === orderId);
    return await apis.orders.get(orderId, orderItem.publicKey);
  };

  const fireInvoiceAnalytics = () =>
    firePageViewAnalyticsEvent(
      `${APP_TITLE} - ${LINK_TITLES.ORDER_INVOICE}`,
      `${window.location.origin}${ROUTES.ORDER_INVOICE}`,
    );

  useEffectOnce(getMoreOrders, [dispatch, offset], !!userId || !!publicKey);

  const onDownloadClick = useCallback(
    async (data: {
      orderId: string;
      orderNumber: string;
      togglePdfLoading: (loading: boolean) => void;
    }) => {
      const { orderId, orderNumber, togglePdfLoading } = data;
      try {
        togglePdfLoading(true);

        fireInvoiceAnalytics();

        const orderItem = ordersList.find(it => it.id === orderId);

        // Get user's timezone
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const pdfData = await apis.generatePdfFile.generateOrderPdf({
          orderId,
          publicKey: orderItem.publicKey,
          timezone: userTimezone, // Send user's timezone
        });

        const binaryString = window.atob(pdfData);
        const binaryLen = binaryString.length;
        const bytes = new Uint8Array(binaryLen);
        for (let i = 0; i < binaryLen; i++) {
          const ascii = binaryString.charCodeAt(i);
          bytes[i] = ascii;
        }
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `FIO-App-order-${orderNumber}.pdf`;
        a.click();

        togglePdfLoading(false);
      } catch (err) {
        togglePdfLoading(false);
        log.error(err);
      }
    },
    [ordersList],
  );

  const onPrintClick = async (orderId: string, orderNumber: string) => {
    try {
      const orderItemToPrint = await getOrder(orderId);

      fireInvoiceAnalytics();

      const componentHtml = ReactDOMServer.renderToString(
        <OrderDetailedPdf orderItem={orderItemToPrint} isPrint={true} />,
      );

      const { width, height } = getPagePrintScreenDimensions({ isPrint: true });

      const winPrint = window.open(
        null,
        'PRINT',
        `width=${width},height=${height},toolbar=0,scrollbars=0,status=0`,
      );

      const preparedPageToPrint = generateOrderHtmlToPrint({
        componentHtml,
        orderNumber,
        isPrint: true,
      });

      winPrint.document.write(preparedPageToPrint);
      setTimeout(() => {
        winPrint.document.close();
        winPrint.focus();
        winPrint.print();
        winPrint.close();
      }, 500);
    } catch (err) {
      log.error(err);
    }
  };

  return {
    hasMoreOrders,
    isNoProfileFlow,
    isDesktop,
    loading,
    ordersList,
    noProfileRedirectParams,
    publicKey,
    getMoreOrders,
    onDownloadClick,
    onPrintClick,
  };
};
