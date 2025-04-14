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
    await Promise.allSettled(methods);
  }

  async executeMethodsArray(methods) {
    const execMethods = async methodsArray => {
      for (const method of methodsArray) {
        try {
          await method();
        } catch (e) {
          //
        }
      }
    };

    await Promise.allSettled(methods.map(methodsArray => execMethods(methodsArray)));
  }
}

export default CommonJob;
