import Base from './Base.mjs';

import { sleep } from '../tools.mjs';

export default class WsBase extends Base {
  constructor(args) {
    super(args);

    if (!args.wsConnection) throw new Error('WS_CONNECTION_REQUIRED');
    this.wsConnection = args.wsConnection;
    this.wsConnection.isAlive = true;

    this.wsConnection.on('message', message => {
      this.wsConnection.send(JSON.stringify({ message: `Received - ${message}` }));
    });

    this.WAIT_PERIOD_MS = 2000;
  }

  async run(params) {
    await this.checkPermissions();
    const cleanParams = await this.validate(params);

    while (this.wsConnection.isAlive) {
      if (!this.wsConnection.isAlive) return this.wsConnection.terminate();

      await this.watch(cleanParams);

      await sleep(this.WAIT_PERIOD_MS);
    }
  }
}
