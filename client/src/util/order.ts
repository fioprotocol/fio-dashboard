import base64Fonts from '../assets/fonts/base64-fonts';

import { PRINT_SCREEN_PARAMS } from '../constants/screen';

export const generateOrderHtmlToPrint = (
  componentHtml: string,
  orderNumber: string,
): string => {
  return `
    <!DOCTYPE html>
    <html style="margin:0;width:${
      PRINT_SCREEN_PARAMS.default.width
    };display:block;height:${PRINT_SCREEN_PARAMS.default.height}">
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
            size: ${PRINT_SCREEN_PARAMS.default.width} ${
    PRINT_SCREEN_PARAMS.default.height
  };
          }
        }
      </style>
      <title>FIO Dashboard Order - ${orderNumber}</title>
      </head>
      <body style="margin:0;width:${
        PRINT_SCREEN_PARAMS.default.width
      };display:block;height:${PRINT_SCREEN_PARAMS.default.height}">
        ${componentHtml.replaceAll('-word-break', 'word-break')}
      </body>
      </html>
    `;
};
