import puppeteer from 'puppeteer';

import Base from './Base';

import { PRINT_SCREEN_PARAMS } from '../config/constants';

export default class GeneratePdfFile extends Base {
  static get validationRules() {
    return {
      data: 'string',
    };
  }

  async execute({ data }) {
    const browser = await puppeteer.launch({ headless: true });

    const page = await browser.newPage();

    await page.setContent(data, { waitUntil: 'domcontentloaded' });
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
