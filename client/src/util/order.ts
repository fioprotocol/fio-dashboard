import base64Fonts from '../assets/fonts/base64-fonts';

import { getPagePrintScreenDimensions } from '../util/screen';

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

  return `
    <!DOCTYPE html>
    <html style="margin:0;width:${width};display:block;height:${height}">
    <head>
    <style>
      @font-face {
        font-family: 'Proxima Nova Regular';
        src: url(data:font/truetype;charset=utf-8;base64,${
          base64Fonts.proximaNovaRegular
        }) format('truetype');
        font-weight: normal;
        font-style: normal;
      }
        @font-face {
        font-family: 'Proxima Nova Semibold';
        src: url(data:font/truetype;charset=utf-8;base64,${
          base64Fonts.proximaNovaSemibold
        }) format('truetype');
        font-weight: normal;
        font-style: normal;
      }
      @font-face {
        font-family: 'Proxima Nova Thin';
        src: url(data:font/truetype;charset=utf-8;base64,${
          base64Fonts.proximaNovaThin
        }) format('truetype');
        font-weight: normal;
        font-style: normal;
      }
      </style>
      <style>
        @media print {
          @page {
            size: ${width} ${height};
          }
        }
      </style>
      <title>FIO Dashboard Order - ${orderNumber}</title>
      </head>
      <body style="margin:0;width:${width};display:block;height:${height}">
        ${componentHtml.replaceAll('-word-break', 'word-break')}
      </body>
      </html>
    `;
};
