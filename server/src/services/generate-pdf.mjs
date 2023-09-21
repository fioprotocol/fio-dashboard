import puppeteer from 'puppeteer';

import Base from './Base';

import { PRINT_SCREEN_PARAMS } from '../config/constants';

import { ProximaNovaRegularBase64 } from '../../static-files/fonts/Proxima-Nova-Regular-base64.mjs';
import { ProximaNovaSemiboldBase64 } from '../../static-files/fonts/Proxima-Nova-Semibold-base64.mjs';
import { ProximaNovaThinBase64 } from '../../static-files/fonts/Proxima-Nova-Thin-base64.mjs';

export default class GeneratePdfFile extends Base {
  static get validationRules() {
    return {
      data: 'string',
    };
  }

  async execute({ data }) {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
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

    await page.setContent(data, { waitUntil: 'domcontentloaded' });
    await page.addStyleTag({
      content: fontFaceRulesString,
    });
    await page.waitForFunction('document.fonts.ready');
    await page.emulateMediaType('screen');

    const pdf = await page.pdf({
      printBackground: true,
      width: PRINT_SCREEN_PARAMS.default.width,
      height: PRINT_SCREEN_PARAMS.default.height,
    });

    await browser.close();

    return {
      data: Buffer.from(pdf).toString('base64'),
    };
  }

  static get paramsSecret() {
    return ['data'];
  }

  static get resultSecret() {
    return ['data'];
  }
}
