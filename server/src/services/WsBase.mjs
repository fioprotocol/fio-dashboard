import Base from './Base.mjs';

import { sleep } from '../tools.mjs';

export default class WsBase extends Base {
  constructor(args) {
    super(args);

    if (!args.wsConnection) throw new Error('WS_CONNECTION_REQUIRED');
    this.wsConnection = args.wsConnection;
    this.wsConnection.isAlive = true;
    this.CLOSED = false;
    this.ERRORED = false;

    this.wsConnection.on('message', message => {
      this.wsConnection.send(JSON.stringify({ message: `Received - ${message}` }));
    });
    this.wsConnection.on('close', this.onClose.bind(this));
    this.wsConnection.on('error', this.onError.bind(this));

    this.WAIT_PERIOD_MS = 2000;
  }

  send(data) {
    if (!this.CLOSED && !this.ERRORED) this.wsConnection.send(data);
  }

  onClose() {
    this.CLOSED = true;
    this.wsConnection.isAlive = false;
    this.wsConnection.terminate();
  }

  onError() {
    this.ERRORED = true;
    this.wsConnection.isAlive = false;
  }

  async run(params) {
    await this.checkPermissions();
    const cleanParams = await this.validate(params);

    while (this.wsConnection.isAlive && !this.CLOSED && !this.ERRORED) {
      if (!this.wsConnection.isAlive) return this.wsConnection.terminate();

      await this.watch(cleanParams);

      await sleep(this.WAIT_PERIOD_MS);
    }
  }
}
