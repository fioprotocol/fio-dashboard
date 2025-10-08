import {
  BC_TX_STATUS_LABELS,
  BC_TX_STATUSES,
  PAYMENT_ITEM_TYPE_LABEL,
  PAYMENT_PROVIDER_LABEL,
  PURCHASE_RESULTS_STATUS_LABELS,
} from '../constants/purchase';
import { ORDER_USER_TYPES_TITLE } from '../constants/order';

import apis from '../api';
import { getPagePrintScreenDimensions } from '../util/screen';
import { transformOrderItemsPDF } from '../util/purchase';
import config from '../config';
import { formatDateToLocale } from '../helpers/stringFormatters';
import { renderFioPriceFromSuf } from '../util/fio';

import { log } from './general';
import { CSVWriter } from './csvWriter';

import { OrderDetails, OrderItemPdf, OrderListFilters } from '../types';

const getFontFamilyStylesString = () => {
  const stylesheets = document.styleSheets;

  // Initialize a string to store the @font-face rules for specific font families
  let fontFaceRulesString = '';

  // Define the font families you want to copy
  const fontFamiliesToCopy = [
    'Proxima Nova Thin',
    'Proxima Nova Semibold',
    'Proxima Nova Regular',
  ];

  // Loop through the stylesheets
  for (let i = 0; i < stylesheets.length; i++) {
    const stylesheet = stylesheets[i];

    // Check if the stylesheet has rules (ignoring cross-origin stylesheets for security reasons)
    if (stylesheet.cssRules) {
      // Loop through the CSS rules in the stylesheet
      for (let j = 0; j < stylesheet.cssRules.length; j++) {
        const rule = stylesheet.cssRules[j];

        // Check if the rule is an @font-face rule (CSSFontFaceRule)
        if (rule.type === CSSRule.FONT_FACE_RULE) {
          // Cast the rule to CSSFontFaceRule to access its CSS text
          const fontFaceRule = rule as CSSFontFaceRule;

          // Check if the font family matches one of the desired font families
          if (
            fontFamiliesToCopy.includes(
              fontFaceRule.style
                .getPropertyValue('font-family')
                .replaceAll('"', ''),
            )
          ) {
            // Access the entire @font-face rule as a string
            const fontFaceRuleString = fontFaceRule.cssText;

            // Concatenate the rule string to the existing fontFaceRulesString
            fontFaceRulesString += fontFaceRuleString;
          }
        }
      }
    }
  }

  return fontFaceRulesString;
};

export const generateOrderHtmlToPrint = ({
  componentHtml,
  orderNumber,
  isPrint,
}: {
  componentHtml: string;
  orderNumber: string;
  isPrint?: boolean;
}): string => {
  const { width, height } = getPagePrintScreenDimensions({ isPrint });

  const fontFaceStyles = isPrint
    ? `<style>${getFontFamilyStylesString()}</style>`
    : '';

  return `
    <!DOCTYPE html>
    <html style="margin:0;width:${width};display:block;height:${height}">
    <head>
    ${fontFaceStyles}
    <style>
      @media print {
        @page {
          size: ${width} ${height};
        }
      }
    </style>
    <title>FIO App Order - ${orderNumber}</title>
    </head>
    <body style="margin:0;width:${width};display:block;height:${height}">
      ${componentHtml.replaceAll('-word-break', 'word-break')}
    </body>
    </html>
  `;
};

type OrdersExportConfig = {
  filters: OrderListFilters;
  ordersCount: number;
  onProgress: (progress: number) => void;
  onError: (error: Error) => void;
};

export const exportOrdersData = async ({
  filters,
  ordersCount,
  onProgress,
  onError,
}: OrdersExportConfig): Promise<void> => {
  let offset = 0;
  let hasMoreData = true;
  let processedOrders = 0;
  let processedOrderItems = 0;
  const FETCH_CHUNK_SIZE = config.exportOrdersCSVLimit;

  try {
    const currentDate = new Date()
      .toISOString()
      .slice(0, 16)
      .replace('T', '_')
      .replace(/:/g, '-');

    // Create writers with proper headers
    const ordersWriter = new CSVWriter({
      filename: `OrdersList_${currentDate}`,
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
    });

    const itemsWriter = new CSVWriter({
      filename: `ItemsList_${currentDate}`,
      headers: [
        'Order ID',
        'Item Type',
        'Amount',
        'FIO',
        'Fee Collected',
        'Status',
      ],
    });

    // Continue with remaining chunks if there are more
    while (hasMoreData) {
      try {
        const { orders = [], orderItems = [] } =
          (await apis.admin.exportOrdersData({
            filters,
            offset,
            limit: FETCH_CHUNK_SIZE,
          })) || {};

        if (orders.length) {
          await processOrdersChunk(orders, ordersWriter);
          await processOrderItemsChunk(orderItems, itemsWriter);

          processedOrders += orders.length;
          processedOrderItems += orderItems.length;

          onProgress(Math.round((processedOrders / ordersCount) * 100));
        }

        if (orders.length < FETCH_CHUNK_SIZE || !orders.length) {
          hasMoreData = false;
        } else {
          offset += FETCH_CHUNK_SIZE;
        }
      } catch (error) {
        log.error(`Export error at offset ${offset}:`, error);
        throw error;
      }
    }

    // Update filenames with final counts before download
    ordersWriter.updateFilename(
      `OrdersList_Total-${processedOrders}_${currentDate}`,
    );
    itemsWriter.updateFilename(
      `ItemsList_Total-${processedOrderItems}_${currentDate}`,
    );

    await ordersWriter.download();
    await itemsWriter.download();
  } catch (error) {
    log.error('Export failed:', error);
    onError(error);
  }
};

const processOrdersChunk = async (
  orders: OrderDetails[],
  writer: CSVWriter,
): Promise<void> => {
  const mappedData = orders.map(order => ({
    'Order ID': order.number,
    Type: order.orderUserType
      ? ORDER_USER_TYPES_TITLE[order.orderUserType]
      : ORDER_USER_TYPES_TITLE.DASHBOARD,
    Date: order.createdAt ? formatDateToLocale(order.createdAt) : '',
    'Partner Profile': order.refProfileName || 'FIO App',
    User: order.userEmail || order.userId,
    'Payment Type': PAYMENT_PROVIDER_LABEL[order.paymentProcessor] || 'N/A',
    Amount: order.total || 0,
    Status: PURCHASE_RESULTS_STATUS_LABELS[order.status],
  }));

  await writer.appendRows(mappedData);
};

const processOrderItemsChunk = async (
  orderItems: OrderItemPdf[],
  writer: CSVWriter,
): Promise<void> => {
  const mappedData = transformOrderItemsPDF(orderItems).map(orderItem => ({
    'Order ID': orderItem.number,
    'Item Type': PAYMENT_ITEM_TYPE_LABEL[orderItem.action],
    Amount: `${orderItem.price} ${orderItem.priceCurrency}`,
    FIO:
      orderItem.price === '0'
        ? '0'
        : renderFioPriceFromSuf(orderItem.nativeFio),
    'Fee Collected': `${orderItem.feeCollected} FIO`,
    Status:
      BC_TX_STATUS_LABELS[orderItem.txStatus] ||
      BC_TX_STATUS_LABELS[BC_TX_STATUSES.NONE],
  }));

  await writer.appendRows(mappedData);
};
