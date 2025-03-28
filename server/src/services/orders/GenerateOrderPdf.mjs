import puppeteer from 'puppeteer';
import Sequelize from 'sequelize';

import Base from '../Base';
import X from '../Exception.mjs';

import { Order, User } from '../../models';

import { PRINT_SCREEN_PARAMS } from '../../config/constants';
import config from '../../config';
import { fioApi } from '../../external/fio.mjs';

import { ProximaNovaRegularBase64 } from '../../../static-files/fonts/Proxima-Nova-Regular-base64.mjs';
import { ProximaNovaSemiboldBase64 } from '../../../static-files/fonts/Proxima-Nova-Semibold-base64.mjs';
import { ProximaNovaThinBase64 } from '../../../static-files/fonts/Proxima-Nova-Thin-base64.mjs';
import logger from '../../logger.mjs';

const imageBase64 =
  'data: image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjE5NCIgdmlld0JveD0iMCAwIDQwMCAxOTQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMF8zMzg5XzI2ODUpIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yNDkuNDE2IDUyLjAzMjhWMTU3LjE4SDI2NC44ODFWNTIuMDMyOEgyNDkuNDE2Wk0xNTcuNTE2IDgzLjY3OTFDMTU3LjY5MiA4Mi40MjM1IDE1Ny45ODUgODEuMTc5OCAxNTguMzYxIDc5Ljk1OTRDMTU5LjE1OSA3Ny40OTUzIDE2MC41NjcgNzUuMjc3NiAxNjIuNDMyIDczLjQ5NEMxNjMuNDUzIDcyLjUyMDEgMTY0LjU5MSA3MS42NzUzIDE2NS44MTIgNzAuOTgzQzE2Ny4xNjEgNzAuMjMyIDE2OC41NjkgNjkuNjEwMiAxNzAuMDM2IDY5LjE0MDhDMTczLjcwOSA2OC4wMDI2IDE3Ny41MzQgNjcuNDUxMSAxODEuMzcxIDY3LjUyMTVMMjIzLjM1NSA2Ny41NDVWNTIuMDkxNEgxODAuMDY4QzE3NC4wMjUgNTEuOTUwNiAxNjguMDA2IDUyLjg1NDEgMTYyLjI4IDU0Ljc5MDJDMTU5Ljk2OCA1NS42NDY4IDE1Ny43NTEgNTYuNzI2MyAxNTUuNjYyIDU4LjAyODhDMTUxLjkwNyA2MC4zNTIxIDE0OC43ODYgNjMuNTQzNyAxNDYuNTU2IDY3LjMyMkMxNDUuNDQyIDY5LjIyMjkgMTQ0LjUzOCA3MS4yMjk0IDE0My44ODEgNzMuMzI5OEMxNDIuNDM4IDc4LjA0NjggMTQxLjczNCA4Mi45NjMzIDE0MS43OTIgODcuODkxNlYxNTcuMThIMTU3LjI0NlYxMTQuMjExSDIyMi43MDlWOTkuNzMxSDE1Ny4yMTFWODcuNjY4NkMxNTcuMjExIDg2LjMzMSAxNTcuMzE2IDg1LjAwNSAxNTcuNTE2IDgzLjY3OTFaIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMzk2Ljk0NiA4MS4zNjc1QzM5NS4xOTggNzUuMzAxIDM5Mi4xIDY5LjcxNTcgMzg3Ljg2NCA2NS4wNDU2SDM4Ny44MjlDMzc5Ljc2OCA1Ni40MjEyIDM2OC4wNDUgNTIuMTE0OSAzNTIuNjYyIDUyLjExNDlIMzM3Ljg2NkMzMzAuOTE5IDUxLjk2MjMgMzI0LjAwOCA1My4wNjUzIDMxNy40NDkgNTUuMzQxN0MzMTEuODI4IDU3LjM3MTcgMzA2Ljc4MyA2MC42OTIzIDMwMi42OTkgNjUuMDQ1NkMyOTQuNTkxIDczLjY3IDI5MC41NDMgODYuOTUyOCAyOTAuNTQzIDEwNC44ODJDMjkwLjU0MyAxMjIuODEyIDI5NC41OTEgMTM1Ljk2NSAzMDIuNjk5IDE0NC4zNzlDMzA2Ljc5NCAxNDguNjg1IDMxMS44NTIgMTUxLjk3IDMxNy40NDkgMTUzLjk1M0MzMjQuMDA4IDE1Ni4yMyAzMzAuOTE5IDE1Ny4zMjEgMzM3Ljg2NiAxNTcuMTkySDM1Mi42NjJDMzU5LjYwOSAxNTcuMzIxIDM2Ni41MiAxNTYuMjMgMzczLjA3OSAxNTMuOTUzQzM3OC42NzYgMTUxLjk3IDM4My43MzQgMTQ4LjY4NSAzODcuODI5IDE0NC4zNzlDMzkyLjA3NiAxMzkuNzY3IDM5NS4xODYgMTM0LjIyOSAzOTYuOTExIDEyOC4yMDlDMzk5LjA5MyAxMjAuNjE3IDQwMC4xMjYgMTEyLjc1NiAzOTkuOTg1IDEwNC44NTlDNDAwLjEzOCA5Ni45MjY2IDM5OS4xMTcgODkuMDA2MiAzOTYuOTQ2IDgxLjM2NzVaTTM4Mi41OTUgMTIxLjIyN0MzODEuNTg2IDEyNS40ODcgMzc5LjYyNyAxMjkuNDUzIDM3Ni44NDYgMTMyLjgzMkMzNzEuNzE4IDEzOC43NTggMzYzLjY4IDE0MS43MTUgMzUyLjc0NCAxNDEuNzI3SDMzNy45NDhDMzMzLjA5IDE0MS44MzIgMzI4LjI1NiAxNDEuMTA1IDMyMy42NDQgMTM5LjU3OUMzMTkuNzYgMTM4LjI3NyAzMTYuMjk5IDEzNS45NjUgMzEzLjYgMTMyLjkxNEMzMTAuODY2IDEyOS41NDcgMzA4Ljk0MiAxMjUuNTkyIDMwNy45NjggMTIxLjM4QzMwNi42NTQgMTE1Ljk4MiAzMDYuMDIgMTEwLjQzMiAzMDYuMTI2IDEwNC44ODJDMzA2LjEyNiA5MS45Mjc5IDMwOC42NiA4Mi40ODIyIDMxMy43MjkgNzYuNTMzMUMzMTYuNDA0IDczLjQzNTQgMzE5Ljg1NCA3MS4xMDAzIDMyMy43MjYgNjkuNzUwOUMzMjguMzAzIDY4LjE5MDMgMzMzLjAzMSA2Ny40MzkzIDMzNy44NjYgNjcuNTQ0OUgzNTIuNjYyQzM1Ny40ODUgNjcuNDM5MyAzNjIuMjk2IDY4LjE5MDMgMzY2Ljg2IDY5Ljc1MDlDMzcwLjc0NCA3MS4wODg1IDM3NC4xOTQgNzMuNDM1NCAzNzYuODU4IDc2LjU0NDlDMzc5LjYwMyA3OS45NTk0IDM4MS41MzkgODMuOTI1NSAzODIuNTI1IDg4LjE4NDlDMzgzLjgzOSA5My41OTQyIDM4NC40NzMgOTkuMTQ0MyAzODQuMzY3IDEwNC43MThDMzg0LjQ4NSAxMTAuMjY4IDM4My44ODYgMTE1LjgzIDM4Mi41OTUgMTIxLjIyN1oiIGZpbGw9IiNGRkZGRkYiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik00Ni4zMDIgMTI0LjkyNFYxODkuNjEzQzQ2LjMwMiAxOTMuMDUxIDQ0LjE0MyAxOTQuNjkzIDQxLjQ3OTQgMTkzLjIzOEw0Ljg4MTM4IDE3My4xNzNDMS45MjQ0NCAxNzEuMTc5IDAuMTE3NDE2IDE2Ny44NTggMC4wMzUyNzgzIDE2NC4yOTFWMTAxLjA2OUMwLjU3NTAzOCAxMDEuNTAzIDEuMTM4MjYgMTAxLjg3OCAxLjczNjY5IDEwMi4yMDdMNDYuMzAyIDEyNC45MjRaIiBmaWxsPSIjNzY1Q0Q2Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMC4wMzUyMDE3IDQ2LjA4MzhWNDguNTU5NkMtMC4wMTE3MzM5IDQ3LjY1NjEgLTAuMDExNzMzOSA0Ni44MzQ3IDAuMDM1MjAxNyA0Ni4wODM4WiIgZmlsbD0iIzc2NUNENiIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTgxLjU4NTggMy40MTkzM1Y0OS4yMDQ5QzgxLjUyNzEgNTIuMTAzMiA4MC4wMDE3IDU0Ljc5MDMgNzcuNTYxMSA1Ni4zMzkyTDU1LjE5NjMgNjcuODAzMkg1NS4xODQ1TDQuMDk1MTQgNDEuNjI0OUM0LjAyNDc0IDQxLjU3OCAzLjk1NDM0IDQxLjU0MjcgMy44ODM5MyA0MS41MDc1QzMuNjk2MTkgNDEuNDEzNiAzLjUwODQ1IDQxLjM1NSAzLjMyMDcgNDEuMjk2M0MzLjE5MTYzIDQxLjI3MjggMy4wNjI1NiA0MS4yMzc2IDIuOTQ1MjIgNDEuMjI1OUMyLjgyNzg4IDQxLjIwMjQgMi43MTA1NCA0MS4yMDI1IDIuNTkzMiA0MS4yMDI1QzIuMjQxMTkgNDEuMjE0MiAxLjkwMDkgNDEuMjk2MyAxLjU4NDA5IDQxLjQzNzFDMS40Nzg0OCA0MS40OTU4IDEuMzcyODggNDEuNTQyNyAxLjI3OTAxIDQxLjYxMzFDMS4yNzkwMSA0MS42MTMxIDEuMjc5MDEgNDEuNjI0OSAxLjI1NTU0IDQxLjYyNDlMMS4yMjAzNCA0MS42NjAxQzIuNjk4ODEgMzguOTczIDUuNTczNjEgMzcuNDI0MSA5Ljg1NjQ5IDM1LjEyNDNMNzcuNTYxMSAwLjQwMzcwNUM3OS43NjcxIC0wLjcyMjc0OSA4MS41ODU4IDAuNTc5NzIyIDgxLjU4NTggMy40MTkzM1oiIGZpbGw9IiM3NjVDRDYiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04MS41ODU3IDg2LjQyNDhWMTMyLjE4N0M4MS41ODU3IDEzNS4wMjcgNzkuNzY3IDEzNi4zNTIgNzcuNTYxIDEzNS4yMjZMNC4wOTUwNCA5Ny41NDg1QzIuNDI4ODMgOTYuNTA0MiAxLjE5Njc3IDk0LjkzMTkgMC41Mzk2NzMgOTMuMTI0OEMwLjU5ODM0MiA5My4yMTg3IDAuNjQ1Mjc4IDkzLjMxMjYgMC43MTU2ODEgOTMuMzk0N0MwLjc2MjYxNyA5My40NTM0IDAuODA5NTUyIDkzLjUxMiAwLjg2ODIyMiA5My41NzA3QzAuODc5OTU2IDkzLjU5NDEgMC44OTE2OSA5My42MDU5IDAuOTE1MTU4IDkzLjYyOTRDMC45NjIwOTMgOTMuNjc2MyAxLjAwOTAzIDkzLjczNSAxLjA2NzcgOTMuNzgxOUMxLjEyNjM3IDkzLjg1MjMgMS4xOTY3NyA5My44OTkyIDEuMjY3MTcgOTMuOTU3OUMxLjM3Mjc4IDk0LjAyODMgMS40NjY2NSA5NC4wOTg4IDEuNTgzOTkgOTQuMTQ1N0MyLjI3NjI5IDk0LjUwOTQgMy4xNTYzMyA5NC40ODYgNC4wOTUwNCA5NC4wMDQ5TDU1LjE4NDQgNjcuODE0OEg1NS4xOTYyTDc3LjU2MSA3OS4yNjcxQzgwLjAxMzQgODAuODI3NyA4MS41MjcgODMuNTE0OCA4MS41ODU3IDg2LjQyNDhaIiBmaWxsPSIjQTA4QUVFIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNTUuMTg0NiA2Ny44MTQ5TDQuMDk1MjEgOTQuMDA1QzMuMTU2NSA5NC40ODYgMi4yNzY0NSA5NC41MDk1IDEuNTg0MTUgOTQuMTQ1OEMxLjQ2NjgxIDk0LjA5ODggMS4zNzI5NCA5NC4wMjg0IDEuMjY3MzQgOTMuOTU4QzEuMTk2OTMgOTMuODk5MyAxLjEyNjUzIDkzLjg1MjQgMS4wNjc4NiA5My43ODJDMS4wMDkxOSA5My43MzUxIDAuOTYyMjU2IDkzLjY3NjQgMC45MTUzMjEgOTMuNjI5NUMwLjg5MTg1MyA5My42MDYgMC44ODAxMTkgOTMuNTk0MiAwLjg2ODM4NSA5My41NzA3QzAuODA5NzE2IDkzLjUxMjEgMC43NjI3OCA5My40NTM0IDAuNzE1ODQ0IDkzLjM5NDhDMC42NDU0NDEgOTMuMzEyNiAwLjU5ODUwNSA5My4yMTg4IDAuNTM5ODM2IDkzLjEyNDlDMC4yMjMwMjEgOTIuNTYxNyAwLjAzNTI3ODMgOTEuODM0MiAwLjAzNTI3ODMgOTAuOTg5M1Y0NC42Mjg3QzAuMDM1Mjc4MyA0My4yNDQxIDAuNDkyOSA0Mi4yMTE1IDEuMjIwNCA0MS42NkMxLjIzMjE0IDQxLjY0ODMgMS4yNDM4NyA0MS42MzY2IDEuMjU1NiA0MS42MzY2QzEuMjU1NiA0MS42MzY2IDEuMjY3MzQgNDEuNjEzMSAxLjI3OTA3IDQxLjYxMzFDMS4zNzI5NCA0MS41NDI3IDEuNDc4NTUgNDEuNDk1NyAxLjU4NDE1IDQxLjQzN0MxLjkwMDk3IDQxLjI5NjIgMi4yNDEyNSA0MS4yMTQyIDIuNTkzMjcgNDEuMjAyNEMyLjcxMDYxIDQxLjIwMjQgMi44Mjc5NSA0MS4yMDI0IDIuOTQ1MjkgNDEuMjI1OEMzLjA2MjYyIDQxLjIzNzYgMy4xOTE3IDQxLjI3MjggMy4zMjA3NyA0MS4yOTYyQzMuNTA4NTEgNDEuMzU0OSAzLjY5NjI1IDQxLjQxMzYgMy44ODQgNDEuNTA3NEMzLjk1NDQgNDEuNTQyNiA0LjAyNDggNDEuNTc3OSA0LjA5NTIxIDQxLjYyNDhMNTUuMTg0NiA2Ny44MTQ5WiIgZmlsbD0iIzhCNzNFMiIvPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzMzODlfMjY4NSI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMTk0IiBmaWxsPSJ3aGl0ZSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo=';

const ORDER_STATUS_LABEL_PDF = {
  [Order.STATUS.PARTIALLY_SUCCESS]: 'Transaction Partially Complete',
  [Order.STATUS.SUCCESS]: 'Transaction Complete',
  [Order.STATUS.FAILED]: 'Transaction Failed',
  [Order.STATUS.CANCELED]: 'Transaction Canceled',
  DEFAULT: 'Transaction in Progress',
};

const width = PRINT_SCREEN_PARAMS.default.width;
const height = PRINT_SCREEN_PARAMS.default.height;

const { mainUrl, fioBlocksTxUrl } = config;

export default class GenerateOrderPdf extends Base {
  static get validationRules() {
    return {
      orderId: ['required', 'string'],
      publicKey: ['string', 'fio_public_key'],
      timezone: ['string'],
    };
  }

  async execute({ orderId, publicKey, timezone = 'America/New_York' }) {
    let browser = null;

    try {
      const userId = this.context.id;
      const guestId = this.context.guestId;

      const where = {
        publicKey,
      };

      const userWhere = {
        userProfileType: {
          [Sequelize.Op.not]: User.USER_PROFILE_TYPE.WITHOUT_REGISTRATION,
        },
      };
      if (userId) {
        where.userId = userId;
        userWhere.id = userId;
      }

      // do not get orders created by primary|alternate users
      if (!userId) {
        userWhere.userProfileType = User.USER_PROFILE_TYPE.WITHOUT_REGISTRATION;
      }

      const order = await Order.orderInfo(orderId, {
        useFormatDetailed: true,
        onlyOrderPayment: true,
        userWhere,
        orderWhere: where,
      });
      if (!order)
        throw new X({
          code: 'NOT_FOUND',
          fields: {
            id: 'NOT_FOUND',
          },
        });

      delete order.data;
      delete order.user;

      if (!userId && order.guestId !== guestId) {
        delete order.payment;
      }

      // Generate HTML content for the PDF
      const htmlContent = this.generateOrderHtmlContent(order, timezone);

      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu',
        ],
      });

      const fontFaceRulesString = `
       @font-face {
          font-family: 'Proxima Nova Regular';
          src: url(data:font/truetype;charset=utf-8;base64,${ProximaNovaRegularBase64}) format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        @font-face {
          font-family: 'Proxima Nova Semibold';
          src: url(data:font/truetype;charset=utf-8;base64,${ProximaNovaSemiboldBase64}) format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        @font-face {
          font-family: 'Proxima Nova Thin';
          src: url(data:font/truetype;charset=utf-8;base64,${ProximaNovaThinBase64}) format('truetype');
          font-weight: normal;
          font-style: normal;
        }
      `;

      const page = await browser.newPage();

      // Set default navigation timeout
      await page.setDefaultNavigationTimeout(30000);

      // Enable JavaScript explicitly
      await page.setJavaScriptEnabled(true);

      // Set viewport
      await page.setViewport({
        width: parseInt(width.replace('px', '')),
        height: parseInt(height.replace('px', '')),
      });

      await page.setContent(htmlContent, {
        waitUntil: ['domcontentloaded', 'networkidle0'], // Wait until network is idle
      });

      await page.addStyleTag({
        content: fontFaceRulesString,
      });
      // Wait for fonts and ensure JavaScript is running
      /* eslint-disable no-undef, no-console */
      const jsEnvironmentCheck = await page.evaluate(() => {
        const report = {
          jsEnabled: true,
          browserFeatures: {},
          errors: [],
        };

        try {
          // Check document availability
          report.browserFeatures.documentAvailable = typeof document !== 'undefined';

          // Check if we can create and manipulate DOM
          if (report.browserFeatures.documentAvailable) {
            const testEl = document.createElement('div');
            testEl.id = 'js-test-element';
            testEl.textContent = 'JavaScript is working';
            document.body.appendChild(testEl);
            report.browserFeatures.domManipulation =
              document.getElementById('js-test-element') !== null;
            document.body.removeChild(testEl);
          }

          // Check fonts API
          report.browserFeatures.fontsAPI = typeof document.fonts !== 'undefined';

          // Browser information
          if (typeof navigator !== 'undefined') {
            report.userAgent = navigator.userAgent;
            report.browserFeatures.cookiesEnabled = navigator.cookieEnabled;
          }

          return report;
        } catch (error) {
          report.jsEnabled = false;
          report.errors.push(error.toString());
          return report;
        }
      });

      logger.info('Browser JavaScript environment check:', jsEnvironmentCheck);
      /* eslint-enable no-undef, no-console */

      await page.emulateMediaType('screen');

      const pdf = await page.pdf({
        printBackground: true,
        width,
        height,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        pdfOptions: {
          enableLinks: true,
        },
      });

      return {
        data: Buffer.from(pdf).toString('base64'),
      };
    } catch (error) {
      logger.error('PDF Generation Error:', error);
      throw new X({
        code: 'PDF_GENERATION_FAILED',
        fields: {
          message: `Failed to generate Order PDF: ${error.message}`,
        },
      });
    } finally {
      if (browser) {
        await browser.close().catch(err => logger.error('Error closing browser:', err));
      }
    }
  }

  combinePriceWithDivider({ totalCostPrice }) {
    const { freeTotalPrice, fioTotalPrice, usdcTotalPrice } = totalCostPrice || {};

    if (freeTotalPrice) return freeTotalPrice;
    if (!fioTotalPrice && !usdcTotalPrice) return 'N/A';

    return `${usdcTotalPrice} (${fioTotalPrice})`;
  }

  transformOrderItemsToTransactionItems(orderItems) {
    return orderItems.map(orderItem => {
      const {
        action,
        address,
        domain,
        priceString,
        transaction_id,
        transaction_ids,
      } = orderItem;

      return {
        description: fioApi.setFioName(address, domain),
        debit: priceString,
        credit: '',
        type: action,
        txId: transaction_id || null,
        txIds: transaction_ids || [],
      };
    });
  }

  generateOrderHtmlContent(order, timezone = 'America/New_York') {
    // Transform order data similar to how OrderDetailedPdf & OrdersPageContext do it
    const orderDetails = {
      title: 'Order Details',
      items: [
        {
          title: 'Date',
          value: this.formatDateWithTimezone(order.createdAt, timezone),
        },
        {
          title: 'Order Number',
          value: order.number,
        },
        {
          title: 'Status',
          value: ORDER_STATUS_LABEL_PDF[order.status] || ORDER_STATUS_LABEL_PDF.DEFAULT,
        },
      ],
    };

    const paymentDetails = {
      title: 'Payment Details',
      items: [],
    };

    paymentDetails.items = [
      {
        title: 'Total Cost',
        value:
          order.payment && order.payment.regTotalCost
            ? this.combinePriceWithDivider({
                totalCostPrice: order.payment.regTotalCost,
              })
            : 'N/A',
      },
      {
        title: 'Paid With',
        value: order.payment && order.payment.paidWith ? order.payment.paidWith : 'N/A',
      },
    ];

    const transactionDetails = {
      title: 'Transaction Details',
      regItems: [],
    };

    // Process order items
    if (order.regItems && order.regItems.length > 0) {
      const orderItemsTransformed = this.transformOrderItemsToTransactionItems(
        order.regItems,
      );
      transactionDetails.regItems = orderItemsTransformed;
    }

    return `
    <!DOCTYPE html>
    <html style="margin:0;width:${width};display:block;height:${height}">
    <head>
    
    <style>
      @media print {
        @page {
          size: ${width} ${height};
        }
      }

      /* Make sure links are clickable and properly styled */
      a {
        color: #0000EE;
        text-decoration: underline;
        cursor: pointer;
      }
      
      a:hover {
        text-decoration: none;
      }
    </style>
    <title>FIO App Order - ${order.number}</title>
    </head>
    <body style="margin:0;width:${width};display:block;height:${height}">
      <div style="display:flex;flex-direction:column;font-family:Proxima Nova Regular;font-size:16px;background-color:#ffffff;width:${width};height:${height}" data-reactroot="">
        <div style="display:flex;justify-content:spaceBetween;background:#1c1c1e;box-shadow:0 6px 4px -2px rgb(0 0 0 / 20%);padding:5px 25px;height:80px">
          <div style="display:flex;align-items:center;justify-content:center">
            <a href="${mainUrl}" style="display:inline-block;">
              <img src="${imageBase64}" alt="fio-logo" style="width:76px;height:auto"/>
            </a>
          </div>
        </div>
        <div style="padding:50px 70px;color:#2b2b2e">
          <div style="margin-top:15px;margin-bottom:15px;font-family:Proxima Nova Semibold;font-size:1.125rem">My Order</div>
          <p style="margin-top:0;margin-bottom:0;font-size:0.875rem;font-family:Proxima Nova Thin">Please find your order information listed below.</p>
          <div style="margin-top:30px;display:flex;flex-direction:row;width:100%;color:#474747">
            <div style="padding:35px 30px 30px 30px;background-color:#fafbfb;border-radius:10px;width:555px">
              <div style="width:100%;border-bottom:1.5px solid #474747;padding-bottom:1rem;margin:0;font-size:1.125rem;font-family:Proxima Nova Semibold">${
                orderDetails.title
              }</div>
              ${orderDetails.items
                .map(
                  (item, index, arr) => `
                <div style="width:100%;padding:1rem 0;${
                  index === arr.length - 1
                    ? 'border-bottom:0;padding:1rem 0 0 0'
                    : 'border-bottom:0.5px solid #474747'
                };display:flex;justify-content:space-between">
                  <div>${item.title}</div>
                  <div>${item.value}</div>
                </div>
              `,
                )
                .join('')}
            </div>
            <div style="padding:35px 30px 30px 30px;background-color:#fafbfb;border-radius:10px;width:555px;margin-left:25px">
              <div style="width:100%;border-bottom:1.5px solid #474747;padding-bottom:1rem;margin:0;font-size:1.125rem;font-family:Proxima Nova Semibold">${
                paymentDetails.title
              }</div>
              ${paymentDetails.items
                .map(
                  (item, index, arr) => `
                <div style="width:100%;padding:1rem 0;${
                  index === arr.length - 1
                    ? 'border-bottom:0;padding:1rem 0 0 0'
                    : 'border-bottom:0.5px solid #474747'
                };display:flex;justify-content:space-between">
                  <div>${item.title}</div>
                  <div>${item.value}</div>
                </div>
              `,
                )
                .join('')}
            </div>
          </div>
          <div style="margin-top:30px;display:flex;flex-direction:row;width:100%;color:#474747;margin-bottom:30px">
            <div style="padding:35px 30px 30px 30px;background-color:#fafbfb;border-radius:10px;width:1135px">
              <div style="width:100%;border-bottom:1.5px solid #474747;padding-bottom:1rem;margin:0;font-size:1.125rem;font-family:Proxima Nova Semibold">${
                transactionDetails.title
              }</div>
              <div style="width:100%;padding:1rem 0;border-bottom:0.5px solid #474747;display:flex;justify-content:space-between">
                <div style="flex-basis:20%">Type</div>
                <div style="flex-basis:34%;word-break:break-word">Description</div>
                <div style="flex-basis:20%">Debit</div>
                <div style="flex-basis:20%">Credit</div>
              </div>
              ${transactionDetails.regItems
                .map(
                  item => `
                <div style="width:100%;padding:1rem 0 0 0;border-bottom:0;display:flex;justify-content:space-between">
                  <div style="width:100%;display:flex;flex-direction:column">
                    <div style="width:100%;display:flex;flex-direction:row;justify-content:space-between">
                      <div style="flex-basis:20%">${item.type}</div>
                      <div style="flex-basis:34%;word-break:break-word">${
                        item.description
                      }</div>
                      <div style="flex-basis:20%">${item.debit}</div>
                      <div style="flex-basis:20%">${item.credit}</div>
                    </div>
                    ${item.txIds
                      .map(
                        txId => `
                      <div style="margin-top:15px;display:flex;flex-direction:row;width:100%;justify-content:space-between">
                        <div style="flex-basis:20%">Transaction ID</div>
                        <a 
                          href="${fioBlocksTxUrl}${txId}" 
                          target="_blank" 
                          rel="noreferrer" 
                          style="flex-basis:78%;display:inline-block;word-break:break-all;color:#0000EE;text-decoration:underline;"
                          onclick="window.open('${fioBlocksTxUrl}${txId}', '_blank')"
                        >
                          ${fioBlocksTxUrl}${txId}
                        </a>
                      </div>
                    `,
                      )
                      .join('')}
                  </div>
                </div>
              `,
                )
                .join('')}
            </div>
          </div>
          <a 
            href="${mainUrl}terms-of-service" 
            target="_blank" 
            rel="noopener noreferrer" 
            style="display:block;padding-top:30px;margin-top:30px;border-top:1px solid #c9c9c9;color:#0000EE;text-decoration:underline;"
            onclick="window.open('${mainUrl}terms-of-service', '_blank')"
          >
            Terms of Service (${mainUrl}terms-of-service)
          </a>
        </div>
      </div>
    </body>
    </html>
  `;
  }

  formatDateWithTimezone(dateString, timezone) {
    try {
      const date = new Date(dateString);

      // Create a date formatter with the specified timezone
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

      // Format the date parts
      const parts = formatter.formatToParts(date);

      // Extract parts to build the formatted string
      const month = parts.find(part => part.type === 'month').value;
      const day = parts.find(part => part.type === 'day').value;
      const year = parts.find(part => part.type === 'year').value;
      const hour = parts.find(part => part.type === 'hour').value;
      const minute = parts.find(part => part.type === 'minute').value;
      const dayPeriod = parts.find(part => part.type === 'dayPeriod').value;

      // Return in the original format: MM/DD/YYYY @ HH:MM AM/PM
      return `${month}/${day}/${year} @ ${hour}:${minute} ${dayPeriod}`;
    } catch (error) {
      logger.error('Error formatting date with timezone:', error);
      // Fallback to the original format without timezone adjustment
      return (
        new Date(dateString).toLocaleDateString() +
        ' @ ' +
        new Date(dateString).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    }
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['data'];
  }
}
