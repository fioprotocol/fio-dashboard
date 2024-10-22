import { ExportToCsv } from 'export-to-csv';

import { FIOSDK } from '@fioprotocol/fiosdk';

import { getPagePrintScreenDimensions } from '../util/screen';

import {
  BC_TX_STATUS_LABELS,
  BC_TX_STATUSES,
  PAYMENT_ITEM_TYPE_LABEL,
  PAYMENT_PROVIDER_LABEL,
  PURCHASE_RESULTS_STATUS_LABELS,
} from '../constants/purchase';
import { ORDER_USER_TYPES_TITLE } from '../constants/order';

import { transformOrderItemsPDF } from '../util/purchase';

import { formatDateToLocale } from '../helpers/stringFormatters';

import { OrderDetails, OrderItemPdf } from '../types';

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

export const generateCSVOrderData = ({
  orders,
  orderItems,
}: {
  orders: OrderDetails[];
  orderItems: OrderItemPdf[];
}) => {
  const currentDate = new Date();

  new ExportToCsv({
    showLabels: true,
    filename: `OrdersList_Total-${
      orders.length
    }_${currentDate.getFullYear()}-${currentDate.getMonth() +
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
    orders.map((order: OrderDetails) => ({
      number: order.number,
      type: order.orderUserType
        ? ORDER_USER_TYPES_TITLE[order.orderUserType]
        : ORDER_USER_TYPES_TITLE.DASHBOARD,
      item: order.createdAt ? formatDateToLocale(order.createdAt) : '',
      refProfileName: order.refProfileName || 'FIO App',
      userEmail: order.userEmail || order.userId,
      paymentProcessor: PAYMENT_PROVIDER_LABEL[order.paymentProcessor] || 'N/A',
      total: order.total || 0,
      status: PURCHASE_RESULTS_STATUS_LABELS[order.status],
    })),
  );

  new ExportToCsv({
    showLabels: true,
    filename: `ItemsList_Total-${
      orderItems.length
    }_${currentDate.getFullYear()}-${currentDate.getMonth() +
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
    transformOrderItemsPDF(orderItems).map(orderItem => ({
      number: orderItem.number,
      itemType: PAYMENT_ITEM_TYPE_LABEL[orderItem.action],
      amount: `${orderItem.price} ${orderItem.priceCurrency}`,
      fio:
        orderItem.price === '0'
          ? '0'
          : FIOSDK.SUFToAmount(orderItem.nativeFio).toFixed(2),
      feeCollected: `${orderItem.feeCollected} FIO`,
      status:
        BC_TX_STATUS_LABELS[orderItem.txStatus] ||
        BC_TX_STATUS_LABELS[BC_TX_STATUSES.NONE],
    })),
  );
};
