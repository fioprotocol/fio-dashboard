import { parentPort } from 'worker_threads';

import '../db';

import logger from '../logger.mjs';

const CANCEL_MSG = 'cancel';

class CommonJob {
  constructor() {
    // store boolean if the job is cancelled
    this.isCancelled = false;
    // store boolean if the job is cancelled
    if (parentPort)
      parentPort.once('message', message => {
        if (message === CANCEL_MSG) this.isCancelled = true;
      });
  }

  postMessage(msg) {
    if (parentPort) return parentPort.postMessage(msg);

    logger.info(msg);
  }

  cancel() {
    this.postMessage(CANCEL_MSG);
  }

  finish() {
    process.exit(0);
  }

  async execute() {}

  async executeActions(methods) {
    const amount = methods.length;

    await new Promise(resolve => {
      let intervalId = null;
      let itemsResolved = 0;
      methods.forEach(async method => {
        try {
          await method();
        } catch (e) {
          //
        }
        ++itemsResolved;
      });
      intervalId = setInterval(() => {
        if (itemsResolved === amount) {
          clearInterval(intervalId);
          resolve();
        }
      }, 500);
    });
  }

  async executeMethodsArray(methods, amount) {
    await new Promise(resolve => {
      let intervalId = null;
      let itemsResolved = 0;
      methods.forEach(async methods => {
        for (const method of methods) {
          try {
            await method();
          } catch (e) {
            //
          }
          ++itemsResolved;
        }
      });
      intervalId = setInterval(() => {
        if (itemsResolved === amount) {
          clearInterval(intervalId);
          resolve();
        }
      }, 500);
    });
  }
}

export default CommonJob;
